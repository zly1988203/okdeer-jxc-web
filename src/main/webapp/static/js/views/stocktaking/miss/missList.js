$(function(){
	
	initSearchParams();
	
	initDgTakeStockMiss();
});

//初始化默认条件
function initSearchParams(){
	$("#branchCodeName").val(sessionBranchCodeName);
	
	//如果不是门店，则传入完整编码
	if(sessionBranchType <3){
		$("#branchCompleCode").val(sessionBranchCompleCode);
	}else{
		$("#selectBranchMore").hide();
		$("#branchCodeName").attr("disabled", true);
	}
	
	$("#txtStartDate").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}


//初始化表格
function initDgTakeStockMiss(){
	stockList = $("#dgMissList").datagrid({
		method:'post',
		align:'center',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		fitColumns:true,    //每列占满
		showFooter:true,
		height:'100%',
		width:'100%',
		columns:[[
//			{field:'check',checkbox:true},
			{field: 'batchNo', title: '盘点批号', width: 100, align: 'left'},
			{field: 'branchCode', title: '机构编号', width: 100, align: 'left'},
			{field: 'branchName', title: '机构名称', width: 180, align: 'left'},
			{field: 'skuCode', title: '货号', width: 100, align: 'left'},
			{field: 'skuName', title: '商品名称', width: 180, align: 'left'},
			{field: 'snapshootStock', title: '系统库存', width: 120, align: 'left'},
			{field: 'categoryCode', title: '类别编号', width: 100, align: 'left'},
			{field: 'categoryName', title: '类别名称', width: 150, align: 'left'}
		]],

	});
	queryForm();
}

//查询
function queryForm(){
	var fromObjStr = $('#queryForm').serializeObject();
	// 去除编码
    //fromObjStr.branchName = fromObjStr.branchName.substring(fromObjStr.branchName.lastIndexOf(']')+1)

	$("#dgMissList").datagrid("options").method = "post";
	$("#dgMissList").datagrid('options').url = contextPath + '/stocktaking/miss/getMissList';
	$("#dgMissList").datagrid('load', fromObjStr);
}

function gFunRefresh(){
	 
}

/**
 * 导出
 */
function toExport(){
	var length = $("#dgMissList").datagrid('getData').total;
	if(length == 0){
		successTip("没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	$("#queryForm").form({
		success : function(data){
			successTip(data.message);
		}
	});
	$("#queryForm").attr("action",contextPath+"/stocktaking/miss/exportMissList?"+fromObjStr);
	$("#queryForm").submit();
}

//打印
function toPrint(){
	var length = $("#dgMissList").datagrid('getData').total;
	if(length == 0){
		successTip("没有数据");
		return;
	}
	var fromObjStr = $('#queryForm').serializeObject();
	var param=setParams("queryForm");
	parent.addTabPrint("异常查询","打印",contextPath+"/stocktaking/miss/printMissList?" + param);
}

function setParams(formId){  
	var param="";
	var arr = $('#' + formId).serializeArray();
	if(arr != null){
		for(var i=0;i<arr.length;i++){
			var _val = encodeURIComponent(arr[i].value);
			if(_val){
				param = param + arr[i].name + "="+_val+"&";
			}
		}
	}
	if(param){
		param = param.substring(0,param.length-1);
	}
	return param;
}

//盘点批号
function searchTakeStock(){
	var branchCompleCode = $('#branchCompleCode').val();
	var param = {
			branchCompleCode:branchCompleCode
	}
	new publicStocktakingDialog(param,function(data){
		$("#batchNo").val(data.batchNo);
	})
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchCompleCode").val(data.branchCompleCode);
		$("#branchCodeName").val("["+data.branchCode+"]"+data.branchName);
	},'BF','');
}

//选择商品
function selectGoods(){
	var branchCompleCode = $("#branchCompleCode").val();
//	var sourceBranchId = branchCompleCode;
//	var targetBranchId = branchCompleCode;
    if(branchCompleCode == ""){
    	successTip("请先选择机构");
        return;
    }
    
    var param = {
    		type:'',
    		key:"",
    		isRadio:'1',
//    		branchId:branchId,
    		branchCompleCode:branchCompleCode,
//    		sourceBranchId:'',
//    		targetBranchId:'',
    		supplierId:'',
    		flag:'0'
    }
    
    new publicGoodsServiceTem(param,function(data){
    	$('#skuId').val(data[0].skuId);
    	$('#skuCodeOrName').val("["+data[0].skuCode+"]"+data[0].skuName);
    });
}

function searchCategory(){
	new publicCategoryService(function(data){
		$("#categoryCode").val(data.categoryCode);
		$("#categoryCodeOrName").val("["+data.categoryCode+"]"+data.categoryName);
	});
}
