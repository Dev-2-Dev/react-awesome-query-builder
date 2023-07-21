import React from "react";
import PropTypes from "prop-types";
import GroupContainer from "../containers/GroupContainer";
import Draggable from "../containers/Draggable";
import {BasicGroup} from "./Group";
import {RuleGroupActions} from "./RuleGroupActions";
import FieldWrapper from "../rule/FieldWrapper";
import {useOnPropsChanged} from "../../utils/reactUtils";
import {ConfirmFn, dummyFn} from "../utils";


@GroupContainer
@Draggable("group rule_group")
@ConfirmFn
class RuleGroup extends BasicGroup {
  static propTypes = {
    ...BasicGroup.propTypes,
    selectedField: PropTypes.string,
    parentField: PropTypes.string,
    setField: PropTypes.func,
  };

  constructor(props) {
    super(props);
    useOnPropsChanged(this);
    this.onPropsChanged(props);
  }

  onPropsChanged(nextProps) {
  }

  childrenClassName = () => "rule_group--children";

  renderHeaderWrapper = () => null;
  renderFooterWrapper = () => null;
  renderConjs = () => null;
  canAddGroup = () => false;
  canAddRule = () => true;
  canDeleteGroup = () => false;

  reordableNodesCntForItem(_item) {
    if (this.props.isLocked)
      return 0;
    const {children1} = this.props;
    return children1.size;
  }

  renderChildrenWrapper() {
    const { config } = this.props;
    const {
      ruleGroupActionsPosition
    } = config.settings;
    
    return (
      <>
        {this.renderDrag()}
        {this.renderField()}
        {(ruleGroupActionsPosition === 'before') && (
            this.renderActions()
        )}
        {super.renderChildrenWrapper()}
        {(ruleGroupActionsPosition === 'after') && (
            this.renderActions()
        )}
      </>
    );
  }

  renderField() {
    const { config, selectedField, setField, removeSelf, setValueCustom, valueCustom, parentField, id, groupId, isLocked } = this.props;
    const { immutableFieldsMode } = config.settings;
    return <FieldWrapper
      key="field"
      classname={"group--field"}
      config={config}
      selectedField={selectedField}
      setField={setField}
      removeSelf={removeSelf}
      setValueCustom={setValueCustom}
      parentField={parentField}
      readonly={immutableFieldsMode || isLocked}
      id={id}
      groupId={groupId}
      valueCustom={valueCustom}
    />;
  }

  renderActions() {
    const {config, addRule, isLocked, isTrueLocked, id} = this.props;

    return <RuleGroupActions
      config={config}
      addRule={addRule}
      canAddRule={this.canAddRule()}
      canDeleteGroup={this.canDeleteGroup()}
      removeSelf={this.removeSelf}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      id={id}
    />;
  }

  extraPropsForItem(_item) {
    return {
      parentField: this.props.selectedField
    };
  }
}


export default RuleGroup;
