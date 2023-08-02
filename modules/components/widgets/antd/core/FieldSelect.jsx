import React, { PureComponent } from "react";
import { Tooltip, Select } from "antd";
import {BUILT_IN_PLACEMENTS, SELECT_WIDTH_OFFSET_RIGHT, calcTextWidth} from "../../../../utils/domUtils";
import PropTypes from "prop-types";
const { Option, OptGroup } = Select;


export default class FieldSelect extends PureComponent {
  static propTypes = {
    config: PropTypes.object.isRequired,
    customProps: PropTypes.object,
    items: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    selectedKey: PropTypes.string,
    selectedKeys: PropTypes.array,
    selectedPath: PropTypes.array,
    selectedLabel: PropTypes.string,
    selectedAltLabel: PropTypes.string,
    selectedFullLabel: PropTypes.string,
    selectedOpts: PropTypes.object,
    readonly: PropTypes.bool,
    //actions
    setField: PropTypes.func.isRequired,
  };

  onChange = (key) => {
    this.props.setField(key);
  };

  filterOption = (input, option) => {
    const dataForFilter = option;
    const keysForFilter = ["title", "value", "grouplabel", "label"];
    const valueForFilter = keysForFilter
      .map(k => (typeof dataForFilter[k] == "string" ? dataForFilter[k] : ""))
      .join("\0");
    return valueForFilter.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const {
      config, customProps, items, placeholder,
      selectedKey, selectedLabel, selectedOpts, selectedAltLabel, selectedFullLabel, readonly,
    } = this.props;
    const {showSearch} = customProps || {};

    const selectText = selectedLabel || placeholder;
    const selectWidth = calcTextWidth(selectText);
    const isFieldSelected = !!selectedKey;
    const dropdownPlacement = config.settings.dropdownPlacement;
    const dropdownAlign = dropdownPlacement ? BUILT_IN_PLACEMENTS[dropdownPlacement] : undefined;
    const width = isFieldSelected && !showSearch ? null : selectWidth + SELECT_WIDTH_OFFSET_RIGHT;
    let tooltipText = selectedAltLabel || selectedFullLabel;
    if (tooltipText == selectedLabel)
      tooltipText = null;

    const fieldSelectItems = this.renderSelectItems(items);

    const selectComponent = this.getSelectComponent();
    let res = React.createElement(selectComponent, {
      dropdownAlign,
      dropdownMatchSelectWidth: false,
      style: { width },
      placeholder,
      size: config.settings.renderSize,
      onChange: this.onChange,
      value: selectedKey || undefined,
      filterOption: this.filterOption,
      disabled: readonly,
      ...customProps,
    }, fieldSelectItems);

    if (tooltipText && !selectedOpts.tooltip) {
      res = <Tooltip title={tooltipText}>{res}</Tooltip>;
    }

    return res;
  }

  renderSelectItems(fields, level = 0) {
    return fields.map(field => {
      const {items, key, path, label, fullLabel, altLabel, tooltip, grouplabel, disabled} = field;
      const groupPrefix = level > 0 ? "\u00A0\u00A0".repeat(level) : "";
      const prefix = level > 1 ? "\u00A0\u00A0".repeat(level-1) : "";
      const pathKey = path || key;
      if (items) {
        const simpleItems = items.filter(it => !it.items);
        const complexItems = items.filter(it => !!it.items);
        const selectOptGroupComponent = this.getSelectOptGroupComponent();
        const gr = simpleItems.length
          ? [React.createElement(selectOptGroupComponent, {key: pathKey, label: groupPrefix+label}, this.renderSelectItems(simpleItems, level+1))]
          : [];
        const list = complexItems.length ? this.renderSelectItems(complexItems, level+1) : [];
        return [...gr, ...list];
      } else {
        const option = tooltip ? <Tooltip title={tooltip}>{prefix+label}</Tooltip> : prefix+label;

        const selectOptionComponent = this.getSelectOptionComponent();
        return React.createElement(selectOptionComponent, {
          key: pathKey,
          value: pathKey,
          title: altLabel,
          grouplabel,
          label,
          disabled,
        }, option);
      }
    }).flat(Infinity);
  }
  
  getSelectComponent = () => {
    const {config: {settings}} = this.props;
    if(settings.fieldSelectComponent) {
      return settings.fieldSelectComponent
    } else {
      return Select
    }
  };

  getSelectOptionComponent = () => {
    const selectComponent = this.getSelectComponent();
    return selectComponent.Option
  };

  getSelectOptGroupComponent = () => {
    const selectComponent = this.getSelectComponent();
    return selectComponent.OptGroup
  };
}
