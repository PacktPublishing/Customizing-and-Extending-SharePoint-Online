import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';

import {SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IArchiveItemCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'ArchiveItemCommandSet';

export default class ArchiveItemCommandSet extends BaseListViewCommandSet<IArchiveItemCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ArchiveItemCommandSet');

    // initial state of the command's visibility
    const archiveCommand: Command = this.tryGetCommand('ARCHIVE_COMMAND_1');
    archiveCommand.visible = false;
    archiveCommand.title = `Archive item`;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'ARCHIVE_COMMAND_1':
        this._archiveItem(event.selectedRows[0].getValueByName('ID'));
        
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const archiveCommand: Command = this.tryGetCommand('ARCHIVE_COMMAND_1');
    if (archiveCommand) {
      // This command should be hidden unless exactly one row is selected.
      archiveCommand.visible = this.context.listView.selectedRows?.length === 1 && this.context.listView.selectedRows[0].getValueByName('FSObjType') === '0';
      archiveCommand.title = `Archive item`;
      
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }

  private _archiveItem(itemId:number){
   
    //const _webUrl = this.context.pageContext.web.absoluteUrl;
    const spOpts: ISPHttpClientOptions = {
      body: ``
    };

    const _listName = this.context.pageContext.list?.title;
    console.log(_listName);
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${_listName}')/items(${itemId})?$select=*,FileLeafRef,FileRef`, 
    SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => { 
       if(response.ok){ 
        response.json().then((item) => {
          console.log(item);
          const _fileRef = item.FileRef;
          const _fileLeafRef = item.FileLeafRef;
          console.log(_fileRef); //CORRECT ONE
          console.log(_fileLeafRef);
          this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/getfilebyserverrelativeurl('${_fileRef}')/moveto(newurl='
          ${this.context.pageContext.list?.serverRelativeUrl+
            "/Archive"}/${_fileLeafRef}')`, SPHttpClient.configurations.v1, spOpts).then((response: SPHttpClientResponse) => {
            if (response.ok) {
              location.reload();
            }
          });
        });
      }
    });

      
    /*this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${_listName}')/items(${itemId})/moveTo(newurl='${this.context.pageContext.list?.serverRelativeUrl+"/Archive"})`, SPHttpClient.configurations.v1,spOpts).then((response: SPHttpClientResponse) => {
      if (response.ok) {
        Dialog.alert(`Item archived`).catch(() => {
        
        });
      } else {
        Dialog.alert(`Error archiving item`).catch(() => {
         
        });
      }
    });*/
  }
}
