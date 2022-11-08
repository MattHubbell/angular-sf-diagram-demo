import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { ChangeEventArgs as NumericChangeEventArgs } from "@syncfusion/ej2-inputs";
import {
  DiagramComponent,
  Diagram,
  NodeModel,
  ConnectorModel,
  LayoutOrientation,
  LayoutAnimation,
  TreeInfo,
  SnapSettingsModel,
  SubTreeOrientation,
  SubTreeAlignments,
  DiagramTools,
  Node,
  DataBinding,
  HierarchicalTree,
  SnapConstraints,
  IFitOptions,
  TextModel
} from "@syncfusion/ej2-angular-diagrams";
import { DataManager } from "@syncfusion/ej2-data";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import * as Data from "./diagram-data.json";
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface EmployeeInfo {
  Role: string;
  color: string;
  Name: string;
}
export interface DataInfo {
  [key: string]: string;
}

/**
 * Sample for Organizational Chart
 */
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild("diagram")
  public diagram: DiagramComponent;
  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None
  };
  public tool: DiagramTools = DiagramTools.ZoomPan;
  public data: Object = {};

  public layout: any = {
    type: "HierarchicalTree"
  };

  //Defines the default node and connector properties
  
  public connDefaults(
    connector: ConnectorModel,
    diagram: Diagram
  ): ConnectorModel {
    connector.targetDecorator.shape = "None";
    connector.type = "Orthogonal";
    connector.constraints = 0;
    connector.cornerRadius = 0;
    return connector;
  }
  ngOnInit(): void {
    
  }
  public create() {
    let options: IFitOptions = { mode: "Width" };
    this.diagram.fitToPage(options);
  }

  public sportsData: Object[] = [
    { Id: "hierarchical", Game: "Hierarchical Layout" },
    { Id: "organizational", Game: "Organizational Chart" },
    { Id: "ComplexHierarchicalTree", Game: "Complex Hierarchical Tree" }
  ];
  public listObj: DropDownListComponent;
  // maps the appropriate column to fields property
  public fields: Object = { text: "Game", value: "Id" };
  // set the height of the popup element
  public height: string = "220px";
  // set the placeholder to DropDownList input element
  public waterMark: string = "Select a game";
  // set the value to select an item based on mapped value at initial rendering
  public value: string = "Game3";
  public onChange(args: any): void {
    debugger;
    if (args.itemData.Id === "hierarchical") {
      this.layout = {
        type: 'HierarchicalTree'
      };
      this.diagram.dataSourceSettings = {
        id: "Name",
        parentId: "Category",
        dataSource: new DataManager((Data as any).hierarchicalTree),
        doBinding: (obj: NodeModel, data: object, diagram: Diagram) => {
          obj.shape = { type: "Text", content: (data as EmployeeInfo).Name };
          obj.style = {
            fill: "violet",
            strokeColor: "none",
            color: "white",
            strokeWidth: 2
          };

          (obj.shape as TextModel).margin = {
            left: 5,
            right: 5,
            bottom: 5,
            top: 5
          };
        }
      };
    } else if (args.itemData.Id === "organizational") {
      this.layout = {
         type: 'OrganizationalChart',
        
      };
      this.diagram.dataSourceSettings = {
        id: "Id",
        parentId: "Manager",
        dataSource: new DataManager((Data as any).localBindData),
        doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
          nodeModel.shape = {
            type: "Text",
            content: (data as EmployeeInfo).Role,
            margin: { left: 10, right: 10, top: 10, bottom: 10 }
          };
          nodeModel.backgroundColor = (nodeModel.data as EmployeeInfo).color;
          nodeModel.style = {
            fill: "none",
            strokeColor: "none",
            color: "white"
          };
        }
      };
    } else if (args.itemData.Id === "ComplexHierarchicalTree") {
      this.layout = {
        type: 'ComplexHierarchicalTree',
        horizontalSpacing: 40, verticalSpacing: 40, orientation: 'TopToBottom',
        margin: { left: 10, right: 0, top: 50, bottom: 0 }
      };
      this.diagram.dataSourceSettings = {
        id: "Name",
        parentId: "ReportingPerson",
        dataSource: new DataManager((Data as any).multiParentData),
        //binds the external data with node
        doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
          /* tslint:disable:no-string-literal */
          nodeModel.style = {
            fill: data["fillColor"],
            strokeWidth: 1,
            strokeColor: data["border"]
          };
          nodeModel.width = 40;
          nodeModel.height = 40;
          //Initialize shape
          nodeModel.shape = {
            type: "Basic",
            shape: "Rectangle",
            cornerRadius: 7
          };
        }
      };
    }
    this.diagram.doLayout();
    this.diagram.dataBind();
  }
}
