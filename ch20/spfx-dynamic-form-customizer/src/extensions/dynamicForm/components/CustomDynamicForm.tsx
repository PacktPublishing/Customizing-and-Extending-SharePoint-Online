import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { DynamicForm } from '@pnp/spfx-controls-react/lib/DynamicForm';
import styles from './CustomDynamicForm.module.scss';
import { IDynamicFieldProps } from '@pnp/spfx-controls-react/lib/controls/dynamicForm/dynamicField/IDynamicFieldProps';
import { TextField } from '@fluentui/react';

export interface ICustomDynamicFormProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'DynamicForm';

export default class CustomDynamicForm extends React.Component<ICustomDynamicFormProps, {}> {
  
  
  
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: DynamicForm mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: DynamicForm unmounted');
  }

  public render(): React.ReactElement<{}> {

    const fieldOverrides: { [columnInternalName: string]: (fieldProperties: IDynamicFieldProps) => React.ReactElement<IDynamicFieldProps> } = {
      'Title': (fieldProps: IDynamicFieldProps): React.ReactElement<IDynamicFieldProps> =>
        <TextField disabled={true}
        label={fieldProps.label}
        defaultValue={fieldProps.fieldDefaultValue}/>,
        'Description': (fieldProps: IDynamicFieldProps): React.ReactElement<IDynamicFieldProps> =>
        <TextField disabled={true}
        label={fieldProps.label}
        defaultValue={fieldProps.fieldDefaultValue}/>,
      
    };
    return  <div className={styles.dynamicForm}>
    <h1>{"Custom Form"}</h1>
    <DynamicForm
        context={this.props.context as never}
        listId={this.props.context.list.guid.toString()}
        listItemId={this.props.context.itemId}
        onCancelled={this.props.onClose}
        onSubmitted={this.props.onSave}
        onSubmitError={(listItemData: unknown, error: Error) => { console.log(error.message); }}
        disabled={this.props.displayMode === FormDisplayMode.Display}
        fieldOverrides={fieldOverrides}
    />
</div>;
  }
}
