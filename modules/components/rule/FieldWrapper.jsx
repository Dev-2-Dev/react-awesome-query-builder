import React, { PureComponent } from "react";
import Field from "./Field";
import {Col} from "../utils";


export default class FieldWrapper extends PureComponent {
  render() {
    const {config, selectedField, setField, removeSelf, parentField, classname, readonly, id, groupId} = this.props;
    return (
      <Col className={classname}>
        { config.settings.showLabels
                    && <label className="rule--label">{config.settings.fieldLabel}</label>
        }
        <Field
          config={config}
          selectedField={selectedField}
          parentField={parentField}
          setField={setField}
          removeSelf={removeSelf}
          customProps={config.settings.customFieldSelectProps}
          readonly={readonly}
          id={id}
          groupId={groupId}
        />
      </Col>
    );
  }
}
