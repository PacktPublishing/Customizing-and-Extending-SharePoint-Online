import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AccidentCounterPropertyPane } from './AccidentCounterPropertyPane';
import { spfi, SPFx as spSPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IAccidentCounterAdaptiveCardExtensionProps {
  title: string;
}

export interface IAccidentCounterAdaptiveCardExtensionState {
  daysWithoutAccident: number;
  lastAccidentDate?: Date;
  accidentsInThisMonth: number;
  accidentsInLastMonth: number;
  accidentsInThisYear: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'AccidentCounter_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AccidentCounter_QUICK_VIEW';

export default class AccidentCounterAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AccidentCounterPropertyPane;

  public onInit(): Promise<void> {
    this.state = { 
      daysWithoutAccident: 0, 
      lastAccidentDate: undefined,
      accidentsInThisMonth:0,
      accidentsInLastMonth:0,
      accidentsInThisYear:0

    };

    this.getAccidentsCount();
    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AccidentCounter-property-pane'*/
      './AccidentCounterPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AccidentCounterPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  private getAccidentsCount(): void {
   const sp = spfi().using(spSPFx(this.context));
    sp.web.lists.getByTitle("Accidents").items().then((items) => {
      const today = new Date();
      const thisMonth = today.getMonth();
      const lastMonth = thisMonth - 1;
          const thisYear = today.getFullYear();
          let accidentsInThisMonth = 0;
          let accidentsInLastMonth = 0;
          let accidentsInThisYear = 0;
          items.forEach((item) => {
            const accidentDate = new Date(item["AccidentDate"]);
            if (accidentDate.getMonth() === thisMonth) {
              accidentsInThisMonth++;
            }
            if (accidentDate.getFullYear() === thisYear) {
              accidentsInThisYear++;
            }
            if(accidentDate.getMonth() === lastMonth){
              accidentsInLastMonth++;
            }
          });
      const mostRecentItem = items.reduce((prev, current) => 
      { const prevDate = new Date(prev["AccidentDate"]); const currentDate = new Date(current["AccidentDate"]); 
        return prevDate > currentDate ? prev : current; 
      });
      const mostRecentDate = new Date(mostRecentItem["AccidentDate"]); 
      const daysWithoutAccident = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
      this.setState({
        daysWithoutAccident,
        lastAccidentDate: mostRecentDate,
        accidentsInLastMonth,
        accidentsInThisMonth,
        accidentsInThisYear
      });
    });
  }


}
