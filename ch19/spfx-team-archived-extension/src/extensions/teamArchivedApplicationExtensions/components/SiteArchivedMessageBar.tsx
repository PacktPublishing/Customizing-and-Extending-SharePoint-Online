import * as React from "react";

import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import {MessageBar, MessageBarType} from 'office-ui-fabric-react/lib/MessageBar';

export interface ISiteArchivedMessageBarProps {
    context: ApplicationCustomizerContext;
    
 }

export default class SiteArchivedMessageBar extends React.Component<ISiteArchivedMessageBarProps>
{
    constructor(props: ISiteArchivedMessageBarProps)
    {
        super(props);
    }

    public render(): React.ReactElement<ISiteArchivedMessageBarProps>
    {
        return(
            <MessageBar
            messageBarType={MessageBarType.severeWarning}
            >This site is archived
            </MessageBar>
        );
    }

    
}