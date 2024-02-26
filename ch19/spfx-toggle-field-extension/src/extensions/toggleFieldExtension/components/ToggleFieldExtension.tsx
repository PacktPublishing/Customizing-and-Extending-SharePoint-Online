import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import styles from './ToggleFieldExtension.module.scss';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
//import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { spfi, SPFx as spSPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export interface IToggleFieldExtensionProps {
  checked: string;
  id: string;
  disabled: boolean;
  context: any;
  // onChanged: (value: boolean, id: string) => void;

}

export interface IToggleFieldExtensionState {
  checked?: boolean;
  id: string;
}
const LOG_SOURCE: string = 'ToggleFieldExtension';

export default class ToggleFieldExtension extends React.Component<IToggleFieldExtensionProps, IToggleFieldExtensionState> {


  private _context: any;
  constructor(props: IToggleFieldExtensionProps, state: IToggleFieldExtensionState) {
    super(props);


    const currentValue = this.props.checked === 'Yes' ? true : false;
    const currentId = this.props.id;
    this._context = this.props.context;
    this.state = {
      checked: currentValue,
      id: currentId
    };

  }



  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: ToggleFieldExtension mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: ToggleFieldExtension unmounted');
  }

  public render(): React.ReactElement<{}> {

    console.log(this.props.checked);

    return (
      <div className={styles.toggleFieldExtension}>
        <Toggle onChange={this.onChanged.bind(this)} offText='Off' onText='On' defaultChecked={this.state.checked} label="Complete?" />

      </div>
    )



  }

  private onChanged(checked: boolean): void {
    const sp = spfi().using(spSPFx(this.props.context));
    let _listTitle: string = "";
    let id = this.state.id;
    let checkedValue = checked ? true : false;
    if (this._context.pageContext && this._context.pageContext.list != undefined) {
      _listTitle = this._context.pageContext.list.title;
      sp.web.lists.getByTitle(_listTitle).items.getById(parseInt(id))().then(i => {
        let updateObject: any = {};
        updateObject["Complete"] = checkedValue;
        sp.web.lists.getByTitle(_listTitle).items.getById(parseInt(id)).update(updateObject).
        then((response: any) => {
          console.log("Item updated");
        });
      });
    }
  }
  

}
