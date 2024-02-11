import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import {
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState
} from '../AccidentCounterAdaptiveCardExtension';

export interface IQuickViewData {
  accidentsThisMonth: string;
  accidentsLastMonth: string;
  accidentsInThisYear: string;
  thisMonthStyle: string;
  lastMonthStyle: string;
  thisYearStyle: string;

}

export class QuickView extends BaseAdaptiveCardQuickView<
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    console.log("IQuickViewData");
    
    return {
      accidentsThisMonth: this.state.accidentsInThisMonth.toString(),
      accidentsLastMonth: this.state.accidentsInLastMonth.toString(),
      accidentsInThisYear: this.state.accidentsInThisYear.toString(),
      thisMonthStyle: this.state.accidentsInThisMonth < this.state.accidentsInLastMonth ? 'good' : 'attention',
      lastMonthStyle: this.state.accidentsInLastMonth < 4  ? 'good' : 'attention',
      thisYearStyle: this.state.accidentsInThisYear < 10 ? 'good' : 'attention'
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
