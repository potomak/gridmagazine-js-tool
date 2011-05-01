$(function() {
  GMTool.loadJson(outputTemplate);
  
  $("#output textarea").change(function() {
    GMTool.loadJson($.parseJSON($(this).val()));
  });
});

var GMTool = {
  indentSpaces: 2,
  
  init: function() {
    this.initSortables();
    this.initDraggable();
  },
  
  initSortables: function() {
    $("ul.sortable").sortable({
      connectWith: "ul"
    });

    $("ul, li").disableSelection();
  },
  
  initDraggable: function() {
    $("#draggable").draggable({
      connectToSortable: ".sortable",
      helper: "clone",
      revert: "invalid"
    });
  },
  
  loadJson: function(json) {
    var linkedList = {};
    var startingPoint;
    
    // reset lists
    $("#lists").html("");
    
    // add a list for each page without pageTop
    // add a list element for each page
    json.pages.forEach(function(page) {
      console.log("page.server_id: " + page.server_id + " - page.pageTop: " + page.pageTop);
      
      if(page.pageTop == "" && page.pageLeft == "") {
        startingPoint = page.server_id;
      }
      
      linkedList[page.server_id] = {
        top: page.pageTop,
        bottom: page.pageBottom,
        right: page.pageRight,
        page: page
      }
    });
    
    console.log(startingPoint);
    console.log(linkedList);
    console.log(Object.keys(linkedList));
    
    // write html for each page
    // FIX: if a section page compare after 
    var pageId = startingPoint;
    for(var i in Object.keys(linkedList)) {
      var pageListItem = "<li id='page" + pageId + "' class='ui-state-highlight'>Page " + pageId + "</li>";
      
      console.log(linkedList[pageId]);
      
      if(linkedList[pageId].top == "") {
        $("#lists").append("<ul id='index" + pageId + "' class='sortable'></ul>");
        $("#index" + pageId).append(pageListItem);
      }
      else {
        $("#page" + linkedList[pageId].top).after(pageListItem);
      }
      
      if(linkedList[pageId].bottom == "") {
        pageId = linkedList[pageId].right;
      }
      else {
        pageId = linkedList[pageId].bottom;
      }
    }
    
    // write JSON string to textarea
    $("#output textarea").val(JSON.stringify(json, null, GMTool.indentSpaces));
    
    this.init();
  }
};