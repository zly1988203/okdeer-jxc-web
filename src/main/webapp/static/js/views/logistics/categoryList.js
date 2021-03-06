/**
 * Created by huangj02 on 2016/8/11.
 */
function goodsArchives(){
    this.selectTypeName = "categoryCode"
    //tree的提交参数
    this.treeParam = {
        categoryCode:'',
        level:'',
    }
    //获取当前选中的树相关参数
    this.currSelectTreeParam = {
		categoryId:'',
		categoryCode:'',
		categoryName:''
    }
    //树的请求地址
    this.treeUrls = [
        {
            name:'categoryCode',
            url:contextPath+'/commonLogistics/category/getGoodsCategoryToTree'
        }
   ];
    this.getTreeUrl = function(name){
        var httpUrl = ""
        $.each(this.treeUrls,function(i,v){
            if(v.name==name){
                httpUrl = v.url;
                return false
            }
        });
        return httpUrl
    }
}
var goodsClass = new goodsArchives();
$(function(){
    initTreeArchives();
    initDatagridArchives();
});

//初始树
function initTreeArchives(){
    var args = { }
    var httpUrl = goodsClass.getTreeUrl(goodsClass.selectTypeName);
    $.get(httpUrl, args,function(data){
        var setting = {
            data: {
                key:{
                    name:'codeText',
                }
            },
            callback: {
                onClick: zTreeOnClick
            }
        };
        $.fn.zTree.init($("#treeArchives"), setting, JSON.parse(data));
        var treeObj = $.fn.zTree.getZTreeObj("treeArchives");
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            treeObj.expandNode(nodes[0], true, false, true);
        }
    });
}
//选择树节点
function zTreeOnClick(event, treeId, treeNode) {
    goodsClass.currSelectTreeParam = {
    		categoryId:treeNode.id,
    		categoryCode:treeNode.code,
    		categoryName:treeNode.text
    }
    goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.code;
    goodsClass.treeParam["level"] = treeNode.level;
    $("#parentId").val(treeNode.id);
    $("#level").val(treeNode.level);
    
    gridReload("gridArchives",goodsClass.treeParam);
};

//查询
function gridReload(gridName,httpParams){
	$("#"+gridName).datagrid("options").url = contextPath+'/commonLogistics/category/queryChildrenCategryList';
    $("#"+gridName).datagrid("options").queryParams = $("#formGoodsCategory").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}


//初始化表格
var gridHandel = new GridClass();
var dg;
function initDatagridArchives(){
	dg = $("#gridArchives").datagrid({
        //title:'普通表单-用键盘操作',
        align:'center',
        url:'',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        //fitColumns:true,    //每列占满
        //fit:true,            //占满
        pageSize:20,
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
             {field:'check',checkbox:true},
             {field:'goodsCategoryId',hidden:true},
             {field:'categoryCode',title:'类别编号',width:'250px',align:'left'},
             {field:'categoryName',title:'类别名称',width:'250px',align:'left'}
        ]],
        onLoadSuccess : function() {
            gridHandel.setDatagridHeader("center");
        }

});
}

//搜索
function queryList(){
	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
    var formParams = $("#formGoodsCategory").serializeObject();
    $("#parentId").val('');
    $("#level").val('');
    $("#startCount").val('');
    $("#endCount").val('');
    $("#gridArchives").datagrid('options').url=contextPath+'/commonLogistics/category/queryChildrenCategryList';
    gridReload("gridArchives", formParams);
    
}

/**
 * 导出
 */
function exportData(){
	var length = $('#gridArchives').datagrid('getData').rows.length;
	if(length == 0){
        $_jxc.alert("无数据可导");
		return;
	}
	$('#exportWin').window({
		top:($(window).height()-300) * 0.5,   
	    left:($(window).width()-500) * 0.5
	});
	$("#exportWin").show();
	$("#totalRows").html(dg.datagrid('getData').total);
	$("#exportWin").window("open");
}

function exportExcel(){
	$("#exportWin").hide();
	$("#exportWin").window("close");

	$("#formGoodsCategory").attr("action",contextPath+"/commonLogistics/category/exportList");
	$("#formGoodsCategory").submit();
}

//重置
function resetFrom(){
	$("#categoryNameOrCode").val('');
	$("#level").val('');
}
