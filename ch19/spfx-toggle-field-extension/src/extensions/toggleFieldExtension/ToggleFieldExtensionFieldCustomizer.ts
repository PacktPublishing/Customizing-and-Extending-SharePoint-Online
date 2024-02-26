import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  BaseFieldCustomizer,
  type IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import {SPHttpClient,SPHttpClientResponse} from '@microsoft/sp-http';
import ToggleFieldExtension, { IToggleFieldExtensionProps } from './components/ToggleFieldExtension';





/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IToggleFieldExtensionFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}



export default class ToggleFieldExtensionFieldCustomizer
  extends BaseFieldCustomizer<IToggleFieldExtensionFieldCustomizerProperties> {
    //private _sp: SPFI;

  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
   //this._sp = spfi().using(SPFx(this.context));
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    const value: string = event.fieldValue;
    const id: string = event.listItem.getValueByName('ID').toString();

    const toggleFieldExtension: React.ReactElement<{}> =
      React.createElement(ToggleFieldExtension, { checked: value, id: id, context: this.context} as IToggleFieldExtensionProps);
    ReactDOM.render(toggleFieldExtension, event.domElement);
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }

  public onToggleValueChanged(checked: boolean, id: string): void {
     let _listTitle: string = "";
    if (this.context.pageContext && this.context.pageContext.list != undefined) {
      _listTitle = this.context.pageContext.list.title;
      console.log(id)
       this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${_listTitle}')/items(${id})`, SPHttpClient.configurations.v1, {    
        headers: [
          ['accept', 'application/json;odata.metadata=none']
        ]
       }).then((response: SPHttpClientResponse) => {  
        response.json().then((item: any) => {
          const updateObject: any ={};
          updateObject["Test"] = checked;
          console.log(updateObject);
          
          console.log(JSON.stringify(updateObject));
          this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${_listTitle}')/items(${id})`, SPHttpClient.configurations.v1, {    
            headers: [
              ['accept', 'application/json;odata.metadata=none'],
              ['content-type', 'application/json;odata.metadata=none'],
              ['IF-MATCH', '*'],
              ['X-HTTP-Method', 'MERGE']
            ],
            body: JSON.stringify({ '__metadata': { 'type': item['__metadata']['type'] }, 'Complete': checked, 'CompletedDate': new Date().toISOString().split('T')[0] + ' 00:00:00Z'})
          }).then((response: SPHttpClientResponse) => {
            console.log(response);
          });
        });

      });
    }
    /*
    const updateObject: any ={};
          updateObject[this.context.field.internalName] = checked;
          if (this.context.pageContext && this.context.pageContext.list != undefined) {
           this._sp.web.lists.getByTitle(this.context.pageContext.list.title).items.getById(parseInt(id)).update({
              updateObject
            }).then((result: IItemUpdateResult): void=> {
              // do something after the item is updated
            });
    }*/
  
  }

}
