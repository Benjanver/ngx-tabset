import { Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter, ContentChild, TemplateRef, AfterViewInit } from '@angular/core';

import { TabComponent } from './tab';

@Component({
  selector: 'ngx-tabset',
  template: `
    <div style="position: absolute">
      <div *ngIf="customSlider" class="tab-nav-marker" [style.left.px]="styleL" [style.width.px]="styleW"></div>
      <ul class="nav-tabset"
          [class.disable-style]="disableStyle"
          [ngClass]="customNavClass">
        <li *ngFor="let tab of tabs"
            (click)="selectTab($event,tab)"
            class="nav-tab"
            [class.active]="tab.active"
            [class.disabled]="tab.disabled">
            <ng-container [ngTemplateOutlet]="tab.simpleView ? simple : complex"
            [ngTemplateOutletContext]="{context:tab}">
            </ng-container>
        </li>
      </ul>
      <div class="tabs-container"
          [ngClass]="customTabsClass">
        <ng-content></ng-content>
      </div>
    </div>
    <ng-template #simple let-context="context">
      <span>{{ context.tabTitle }}</span>
    </ng-template>
    <ng-template #complex let-context="context">
      <ng-container [ngTemplateOutlet]="childTemplate" [ngTemplateOutletContext]="{context:context.customView}"></ng-container>
    </ng-template>
  `
})
export class TabsetComponent implements AfterContentInit, AfterViewInit {

  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;

  @Input() public disableStyle = false;
  @Input() public customNavClass: string = '';
  @Input() public customTabsClass: string = '';
  @Input() public customSlider = false;

  @Output() public onSelect = new EventEmitter();

  @Input() public childTemplate: TemplateRef<any>;

  private styleW = 0;
  private styleL = 0;
  // contentChildren are set
  public ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab: TabComponent) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(null, this.tabs.first);
    }
  }

  public ngAfterViewInit() {
    const tabs = document.querySelectorAll('ul .nav-tab');
    setTimeout(() => {
      (tabs[0] as HTMLElement).click();
    }, 1);
  }

  public changeSlider(ev: any) {
    if (this.customSlider && ev) {
      this.styleL = ev.currentTarget.offsetLeft;
      this.styleW = ev.currentTarget.offsetWidth;
    }
  }

  public selectTab(ev: any, tabToSelect: TabComponent): void {

    if (tabToSelect.disabled === true || tabToSelect.active === true) {
      if (!tabToSelect.disabled) {
        this.changeSlider(ev);
      }
      return;
    }

    // deactivate all tabs
    this.tabs.toArray().forEach((tab: TabComponent) => tab.active = false);

    // activate the tab the user has clicked on.
    tabToSelect.active = true;
    this.changeSlider(ev);

    this.onSelect.emit(this.tabs.toArray().indexOf(tabToSelect));
  }
}
