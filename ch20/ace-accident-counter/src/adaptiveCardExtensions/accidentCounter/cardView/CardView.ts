import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
    IExternalLinkCardAction,
  IQuickViewCardAction,
  PrimaryTextCardView
} from '@microsoft/sp-adaptive-card-extension-base';
//import * as strings from 'AccidentCounterAdaptiveCardExtensionStrings';
import {
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../AccidentCounterAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IAccidentCounterAdaptiveCardExtensionProps,
  IAccidentCounterAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.state.daysWithoutAccident.toString()+
        ((this.state.daysWithoutAccident == 1) ? " day without an accident":" days without an accident")
      },body: {
        componentName: 'text',
        text: "Last accident happened on "+this.state.lastAccidentDate?.toLocaleDateString()
      },
      footer: {
        componentName: 'cardButton',
        title: "Accidents",
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
