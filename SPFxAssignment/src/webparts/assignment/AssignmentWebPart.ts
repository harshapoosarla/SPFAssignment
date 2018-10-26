import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './AssignmentWebPart.module.scss';
import * as strings from 'AssignmentWebPartStrings';
import * as $ from 'jquery';
import * as bs from 'bootstrap'; 

import { SPComponentLoader } from '@microsoft/sp-loader';
require('bootstrap');
export interface ISpfxWebPartProps {
  description: string;
}

export default class SpfxWebPart extends BaseClientSideWebPart<ISpfxWebPartProps> {

  public render(): void {
     let url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
var URL = this.context.pageContext.web.absoluteUrl;
     SPComponentLoader.loadCss(url);
    this.domElement.innerHTML = `

      <div class="${ styles.assignment }">
      <div class="${ styles.container }">
        
      <div class="${ styles.row }">
        <div class="${ styles.column }">
          <span class="${ styles.title }"></span>
          <p class="${ styles.subTitle }"></p>
       
          <div >
          
          <h1>Carousel Example</h1>
          <div id="myCarousel" class="carousel slide" data-ride="carousel">
            <!-- Indicators -->
            <ol class="carousel-indicators" id="orderlistid">           
            </ol>        
            
            <!-- Wrapper for slides -->
            <div class="carousel-inner" id="scroll">
            </div>
            
            
            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel" data-slide="prev">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel" data-slide="next">
              <span class="glyphicon glyphicon-chevron-right"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  
  
  <!-- Modal -->
  <div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
  
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Modal Header</h4>
        </div>
        <div class="modal-body" id="modal-body">
          <p>Some text in the modal.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
  
    </div>
  </div>`;

      $(document).ready(function(){

      });
      $(document).on("click", ".btn-info" , function() {
        var a =  $(this).attr("id");
        alert(a);
        $('#modal-body div').remove();
       $('#myModal').modal('show');   
       
       var call = jQuery.ajax({
        url:URL+ "/_api/Web/Lists/getByTitle('Managers Speaks')/Items?$select=ImageUrl,Subject,Description,ID&$filter=(ID eq '"+a+"')&$orderby= Created desc",
         type: "GET",
         dataType: "json",
         headers: {
             Accept: "application/json; odata=verbose",
             "Content-Type": "application/json;odata=verbose"
         }
     });
       call.done(function (data, textStatus, jqXHR) {     
       
         //  $('#modal-body div').remove();
           var popupData = $('#modal-body');
           $.each(data.d.results, function (idx, element) {
            
               popupData.append("<div class='col-md-12' style='margin-top: 5%;'><div class='col-md-8' style=''><img src='"+element.ImageUrl+"' style='width: 100%;'></div><div class='col-md-4' style='padding-top: 5%;'><p><h4 style='font-weight: bold;'>Subject : </h4>"+element.Subject+"</p></div></div>");
               popupData.append("<div class='col-md-12' style='margin-top: 5%;'><h5 style='font-weight: bold;'>Description : </h5>"+element.Description+"</div>");
             
           });
       });
           call.fail(function (jqXHR, textStatus, errorThrown) {
           var response = JSON.parse(jqXHR.responseText);
           var message = response ? response.error.message.value : textStatus;
           alert("Call hutch failed. Error: " + message);
       });

     }); 
  
      this.getListsInfo();    
}
  
  
      public getListsInfo() 
      {
        alert("entered getlistsinfo event");
        let html: string = '';
        if (Environment.type === EnvironmentType.Local) {
          this.domElement.querySelector('#lists').innerHTML = "Sorry this does not work in local workbench";
        } else {
      
          var call = $.ajax({
            url:this.context.pageContext.web.absoluteUrl+ `/_api/web/lists/GetByTitle('Managers Speaks')/Items?$select = 'Subject,ImageUrl,Description'`, 
            type: 'GET',
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
        });
      
        call.done(function (data, textStatus, jqXHR) {          
          $('#orderlistid li').remove();
          $('#scroll div').remove();
          var orderedList = $('#orderlistid');
          var corosalContainer = $('#scroll');
          $.each(data.d.results, function (idx, element) {
            if(idx == "0")
            {
              orderedList.append("<li data-target='#myCarousel' data-slide-to='" + element.ID + "' class='active' ></li>");
              corosalContainer.append("<div class='item active'><div class='col-md-8' style='padding-left: 15%;'><img src='"+element.ImageUrl+"' style='width: 50%;'></div><div class='col-md-4'><p style='font-weight: bold;'>Subject : </p><p>"+element.Subject+"</p><button type='button' class='btn btn-info btn-sm' data-toggle='modal' id='"+ element.ID  +"'>More</button></div></div>")
            }
            else{
              orderedList.append("<li data-target='#myCarousel' data-slide-to='" + element.ID + "'></li>");
              corosalContainer.append("<div class='item'><div class='col-md-8' style='padding-left: 15%;'><img src='"+element.ImageUrl+"' style='width: 100%;'></div><div class='col-md-4'><p style='font-weight: bold;'>Subject : </p><p>"+element.Subject+"</p><button type='button' class='btn btn-info btn-sm callmodalJquery' data-toggle='modal' id='"+ element.ID  +"'>More</button></div></div>")
            }
            
          });
      });
      
      call.fail(function (jqXHR, textStatus, errorThrown) {
          var response = JSON.parse(jqXHR.responseText);
          var message = response ? response.error.message.value : textStatus;
          alert("Call failed. Error: " + message);
      });
      }  
    }
    protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}