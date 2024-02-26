import * as React from "react";
import * as ReactDOM from "react-dom";
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { MSGraphClientV3 } from "@microsoft/sp-http";
import * as strings from 'TeamArchivedApplicationExtensionsApplicationCustomizerStrings';
import SiteArchivedMessageBar from "./components/SiteArchivedMessageBar";
import { ISiteArchivedMessageBarProps } from './components/SiteArchivedMessageBar';

const LOG_SOURCE: string = 'TeamArchivedApplicationExtensionsApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITeamArchivedApplicationExtensionsApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class TeamArchivedApplicationExtensionsApplicationCustomizer
  extends BaseApplicationCustomizer<ITeamArchivedApplicationExtensionsApplicationCustomizerProperties> {
  private _topPlaceHolder: PlaceholderContent | undefined;
  private _groupId:string;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    
    // Get the group ID of the current site
    this._groupId = this.context.pageContext.site.group.id; 
    if(this._groupId != null)
    {
      this._renderPlaceHolders();
    }
    
    
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {

    if (!this._topPlaceHolder) {
      this._topPlaceHolder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });
      if (this._topPlaceHolder && this._topPlaceHolder.domElement ) 
      {
        this.context.msGraphClientFactory
        .getClient('3')
        .then((client: MSGraphClientV3): void => {
          client.api('teams/'+this._groupId).get((error, team) => {
            if(team != null && team.isArchived)
            {
              const element: React.ReactElement<ISiteArchivedMessageBarProps> = 
              React.createElement(SiteArchivedMessageBar, { context: this.context });
              ReactDOM.render(element, this._topPlaceHolder!.domElement);
            }
        });
      });

    }
  }
}

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
