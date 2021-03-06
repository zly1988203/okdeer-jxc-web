/**
 * Created by huangj02 on 2016/8/9.
 */

//html5 localStorage 存值永久有效
window.localStorageUtil = {
   setLocalStorageItem:function(localName,localObj){ //设置存储数据，传入key和value；key是任意的字符串，value是一个object
      localStorage.setItem(localName,JSON.stringify(localObj));
   },
   getLocalStorageItem:function(localName){ //获取存储数据，传入之前设置的key
      var data = JSON.parse(localStorage.getItem(localName));
      return data;
   },
   delLocalStorageItem:function(localName){ //删除存储数据，传入之前设置的key
	   localStorage.removeItem(localName);
   },
   clearStorageItem:function(){ //清空所有存储数据
      localStorage.clear()
   }
}

function goodsArchives(){
    this.selectTypeName = "categoryCode"
    //tree的提交参数
    this.treeParam = {
        categoryCode:'',
        supplierId:'',
        brandId:'',
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
            url:contextPath+'/common/category/getGoodsCategoryToTree'
        },
        {
            name:'brandId',
            url:contextPath+'/common/brand/getBrandToTree'
        },
        {
            name:'supplierId',
            url:contextPath+'/common/supplier/getSupplierToTree'
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
	//关闭初始化淘汰向导页面
	closeOutGuideDialog();
	closeStopGuideDialog();
	
	initView();
	initTreeArchives();
	initDatagridOrders();
	//清楚缓存
	localStorageUtil.clearStorageItem();
});

//状态切换
$(document).on("click","input[name='status']",function(){
	var statusValue = $("input[name='status']:checked").val();
	
	switch(statusValue){
		case '0': //正常
			//
			$(".importbtn").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_stop01").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_stop02").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_stopout").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_weedout01").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_weedout02").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			
			$("#recover").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			break;
		case '2': //停购
			$(".importbtn").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_stop01").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stop02").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stopout").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			
			$("#recover").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_weedout01").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_weedout02").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			
			break;
		case '3': //淘汰
		case '1': //停售
			$(".importbtn").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			$("#btn_stop01").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stop02").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stopout").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_weedout01").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_weedout02").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			
			$("#recover").removeClass("ubtns-item-disabled").addClass("ubtns-item");
			break;
		default:
			$(".importbtn").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stop01").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stop02").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_stopout").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_weedout01").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#btn_weedout02").removeClass("ubtns-item").addClass("ubtns-item-disabled");
			$("#recover").removeClass("ubtns-item").addClass("ubtns-item-disabled");
	}
	query();
})

function initView(){
	$('#goodsType').combobox({
		valueField:'id',
		textField:'text',
		data: [{
			id: 'categoryCode',
			text: '类别',
			selected:true,
		},{
			id: 'brandId',
			text: '品牌'
		},{
			id: 'supplierId',
			text: '供应商'
		}],
		onSelect: function(record){
			goodsClass.selectTypeName = record.id;
			initTreeArchives();
		},
	});
}

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
    if(goodsClass.selectTypeName=="categoryCode"){
    	//获取当前选中的”类别“相关参数
    	goodsClass.currSelectTreeParam = {
    		categoryId:treeNode.id,
    		categoryCode:treeNode.code,
    		categoryName:treeNode.text
        }
        goodsClass.treeParam[goodsClass.selectTypeName] = treeNode.code;
        //将选中树参数值传入表单
        $("#categoryCode").val(treeNode.code);
        $("#brandId").val('');
        $("#supplierId").val('');
        $("#startCount").val('');
    	$("#endCount").val('');
    }
    gridReload("goodsStatus",goodsClass.treeParam,goodsClass.selectTypeName);
};

function gridReload(gridName,httpParams,selectTypeName){
	switch (selectTypeName){ 
		case "categoryCode":  //类别
			httpParams.supplierId = "";
			httpParams.brandId = "";
			break;
	}
	//将左侧查询条件设置缓存中
	setLocalStorage();
	$("#"+gridName).datagrid("options").url = contextPath+'/goods/status/getGoodsStatusList';
	$("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
    $("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("load");
}


//初始化表格
var dg;
function initDatagridOrders(){
	dg=$("#goodsStatus").datagrid({
		//title:'普通表单-用键盘操作',
		align:'center',
		method: 'post',
		singleSelect:false,  //单选  false多选
		rownumbers:true,    //序号
		pagination:true,    //分页
		showFooter:true,
		pageSize:20,
		height:'100%',
		columns:[[  
		          {field:'branchSkuId',checkbox:true},
		          {field:'branchName',title:'机构名称',width:'100px',align:'left'},  
	              {field:'branchCode',title:'机构编码',width:'80px',align:'left'},
	              {field:'skuCode',title:'货号',width:'100px',align:'left'}, 
		          {field:'skuName',title:'商品名称',width:'180px',align:'left'}, 
		          {field:"barCode",title:"条码",width:100,align:'left'},
		          {field:"status",title:"商品状态",width:100,align:'center',formatter:function(value,row,index){
	                	if(value == '0'){
	                		return '正常';
	                	}else if(value == '1'){
	                		return '停售';
	                	}else if(value == '2'){
	                		return '停购';
	                	}else if(value == '3'){
	                		return '淘汰';
	                	}else{
	                		return '未知状态：'+ value;
	                	}
	                }},
		          {field:"purchaseSpec",title:"进货规格",width:100,align:'left'},
		          {field:"distributionSpec",title:"配送规格",width:100,align:'left'},
		          {field:"fastDeliver",title:"是否直送商品",width:80,align:'center',formatter:function(value,row,index){
	                	if(value == '0'){
	                		return '否';
	                	}else if(value == '1'){
	                		return '是';
	                	}
	                }},
		          {field:"salePrice",title:"零售价",width:80,align:'right'},
		          {field:"actual",title:"实际库存",width:80,align:'right'}
		          ]] ,
		          toolBar : "#tg_tb",
		          enableHeaderClickMenu: false,
		          enableHeaderContextMenu: false,
		          enableRowContextMenu: false

	});
}

/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		console.log(data);
	$("#branchName").val('['+data.branchCode+']'+data.branchName);
	$("#branchCode").val(data.branchCompleCode);
	$("#branchId").val(data.branchesId);
	},"","");
}

/**
 * 商品货号
 */
function selectSkuCode(){
    var param = {
        type:'',
        key:'',
        isRadio:1,
        sourceBranchId:"",
        targetBranchId:"",
        branchId:branchId,
        supplierId:'',
        flag:'0',
    }

	new publicGoodsServiceTem(param,function(data){
		$("#skuBarCode").val(data[0].skuCode);
	});

}
//搜索导出清除左侧条件
function cleanLeftParam(){
	$("#categoryCode").val('');
}

//将左侧查询条件设置缓存中
function setLocalStorage(){
	var categoryCode = $("#categoryCode").val();
	var obj={"categoryCode":categoryCode}
	localStorageUtil.setLocalStorageItem("storge",obj);
}

//查询
function query(){
	//搜索导出清除左侧条件
	cleanLeftParam();
	$("#startCount").val('');
	$("#endCount").val('');
	var oldBranchName = $("#oldBranchName").val();
	var branchName = $("#branchName").val();
	if(!branchName && branchName != oldBranchName ){
		$("#branchId").val('');
		$("#branchCode").val('');
	}
	var branchName = $("#branchName").val();
	var skuBarCode = $("#skuBarCode").val();
	var skuName = $("#skuName").val();
	if(!branchName && !skuBarCode && !skuName){
		$_jxc.alert("机构与条码或名称必须输入其中一个条件.");
		return;
	}
	//将左侧查询条件设置缓存中
	setLocalStorage();
	
	//去除左侧选中样式
	$('.zTreeDemoBackground a').removeClass('curSelectedNode');
	
	$("#goodsStatus").datagrid("options").queryParams = $("#queryForm").serializeObject();
	$("#goodsStatus").datagrid("options").method = "post";
	$("#goodsStatus").datagrid("options").url = contextPath+"/goods/status/getGoodsStatusList";
	$("#goodsStatus").datagrid("load");
}
//重置
function resetFrom(){
	$("#queryForm").form('clear');
}

//对话框
var dialogTemp;
//打开对话框
function openDialog(argUrl, argTitle, skuId,branchId) {
	dialogTemp = $('<div/>').dialog({
		href : argUrl,
		width : 940,
		height : 620,
		title : argTitle,
		closable : true,
		resizable : true,
		onClose : function() {
			$(dialogTemp).panel('destroy');
		},
		modal : true,
		onLoad : function() {
			initGoodsInfo(skuId,branchId);
		}
	})
}
//关闭对话框
function closeDialog() {
	$(dialogTemp).panel('destroy');
}



/**
 * 导入
 */
function importHandel(type,obj){
	    if($(obj).hasClass('ubtns-item-disabled'))return;
	    var branchId = $("#branchId").val();
	    var status = $('input[name="status"]:checked ').val();
	    //判定发货分店是否存在  
		//JIANGSHAO
	    if($("#branchId").val()==""){   
	        $_jxc.alert("请选择机构");
	        return;
	    } 
	    var param = {
	        url:contextPath+"/goods/status/importList",
	        tempUrl:contextPath+"/goods/status/exportTemp",
	        branchId:branchId,
	        type:type,
	        status:status
	    }
	    new publicUploadFileService(function(data){
	        updateListData(data);
	    },param)
}

function updateListData(data){
	    $("#goodsStatus").datagrid("loadData",data);
	}
//停购（type：0）、停售（type：1）、淘汰（type：2）、恢复（type：3）
function update(type,obj){
	var branchId = $("#branchId").val();
	if($(obj).hasClass('ubtns-item-disabled'))return;
	var rows = $('#goodsStatus').datagrid('getChecked');
	if(rows.length == 0){
		$_jxc.alert('请至少选中一行！');
		return;
	}
	
	var flag = false;
	var ids = '';
	$.each(rows,function(i,v){
		//淘汰操作
		if(type ==2){
			if(v.actual != 0){
				flag = true;
			}
		}
		ids+=v.branchSkuId+",";
	});
	if(flag){
		$_jxc.alert('淘汰商品库存必须为0！');
		return;
	}
	$_jxc.confirm('是否要处理选中数据?',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/goods/status/updateGoodsStatus",
		    	data:{
		    		ids:ids,
		    		type:type,
		    		branchId:branchId
		    	}
		    },function(result){
	    		
	    		if(result['code'] == 0){
	    			initTreeArchives();
	    			$_jxc.alert("success",function(){
	    				dg.datagrid('reload');
	    			});
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

function outGuide(obj){
	if($(obj).hasClass('ubtns-item-disabled'))return;
	resetGuideData();
	$("#outGuideCurrBranch").html($("#branchName").val());
	
	$("#outGuideDailog").dialog('open');
}

//关闭淘汰向导
function closeOutGuideDialog(){
	$("#outGuideDailog").dialog('close');
}
//确认淘汰向导
function checkOutGuide(){
	var guideType = $("input[name='guideType']:checked").val();
	var guideChoose = $("input[name='guideChoose']:checked").val();
	var guideDate = $("#guideDatew").numberbox('getValue');
	var branchCode = $("#branchCode").val();
	var params = {
			guideType:guideType,
			guideChoose:guideChoose,
			guideDate:guideDate,
			branchCompleCode:branchCode
	};
	$("#goodsStatus").datagrid("options").queryParams = params;
	$("#goodsStatus").datagrid("options").method = "post";
	$("#goodsStatus").datagrid("options").url = contextPath+"/goods/status/getOutGuideList";
	$("#goodsStatus").datagrid("load");
	$("#outGuideDailog").dialog('close');
}

function checkStopGuide(){
	var guideType = $("input[name='stGuideType']:checked").val();
	var guideChoose = $("input[name='stGuideChoose']:checked").val();
	var guideDate = $("#stGuideDate").numberbox('getValue');
	var guideNum = $("#stGuideNum").numberbox('getValue');
	var branchCode = $("#branchCode").val();
	var params = {
			guideType:guideType,
			guideChoose:guideChoose,
			guideDate:guideDate,
			guideNum:guideNum,
			branchCompleCode:branchCode
	};
	$("#goodsStatus").datagrid("options").queryParams = params;
	$("#goodsStatus").datagrid("options").method = "post";
	$("#goodsStatus").datagrid("options").url = contextPath+"/goods/status/getStopGuideList";
	$("#goodsStatus").datagrid("load");
	$("#stopGuideDailog").dialog('close');
}
//初始化数据
function resetGuideData(){
	$("input[name='guideType']").prop("checked",false).eq(0).prop("checked",true);
	$("input[name='guideChoose']").prop("checked",false).eq(0).prop("checked",true);
	$("#guideDatew").numberbox('setValue',15);
}

function stopGuide(obj){
	if($(obj).hasClass('ubtns-item-disabled'))return;
	resetStopGuideData();
	$("#stopGuideCurrBranch").html($("#branchName").val());
	$("#stopGuideDailog").dialog('open');
}

//关闭淘汰向导
function closeStopGuideDialog(){
	$("#stopGuideDailog").dialog('close');
}
//初始化数据
function resetStopGuideData(){
	$("input[name='stGuideType']").prop("checked",false).eq(0).prop("checked",true);
	$("input[name='stGuideChoose']").prop("checked",false).eq(0).prop("checked",true);
	$("#stGuideDate").numberbox('setValue',15);
	$("#stGuideNum").numberbox('setValue',5);
}



var  dalogTemp;
//打开Dialog
function openDialog(argUrl,argTitle) {
dalogTemp = $('<div/>').dialog({
    href: argUrl,
    top:200,
//    width:580,
//    height: 400,
    title: argTitle,
    closable: true,
    resizable: true,
    onClose: function () {
        $(dalogTemp).panel('destroy');
    },
    modal: true,
    onLoad: function () {

    }
})
}
