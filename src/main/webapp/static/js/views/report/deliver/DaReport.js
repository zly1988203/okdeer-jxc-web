/**
 * Created by zhanghuan on 2016/8/30.
 * 要货单
 */
$(function(){
	//开始和结束时间

    toChangeDatetime(10);
    initDatagridRequireOrders();
    branchId = $("#branchId").val();
    brancheType = $("#brancheType").val();
});
var gridHandel = new GridClass();
//初始化表格
function initDatagridRequireOrders(){
    $("#deliverFormList").datagrid({
        //title:'普通表单-用键盘操作',
        method:'post',
        align:'center',
        url:'',
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        fitColumns:true,    //每列占满
        //fit:true,            //占满
        showFooter:true,
        pageSize : 50,
		height:'100%',
		width:'100%',
        columns:[[
			{field:'check',checkbox:true},
			{field:'formNo',title:'单据编号',width:'130px',align:'left',formatter:function(value,row,index){
				var hrefStr='parent.addTab("详情","'+contextPath+'/form/deliverForm/deliverEdit?report=close&deliverFormId='+row.deliverFormId+'")';
				return '<a style="text-decoration: underline;" href="#" onclick='+hrefStr+'>' + value + '</a>';
            }},
            {field:'sourceBranchCode',title: '发货机构编码', width: '56px', align: 'left'},
            {field: 'sourceBranchName', title: '发货机构', width: '86px', align: 'left'},
            {field: 'targetBranchCode', title: '要货机构编码', width: '56px', align: 'left'},
            {field: 'targetBranchName', title: '要货机构', width: '86px', align: 'left'},
            {field: 'amount', title: '单据金额', width: '80px', align: 'right',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            		}
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
            	}
            },
			{field: 'dealStatus', title: '单据状态', width: '60px', align: 'left'},
			{field: 'validityTime', title: '有效期限', width: '115px', align: 'center',
				formatter: function (value, row, index) {
					if (value) {
						return new Date(value).format('yyyy-MM-dd');
					}
					return "";
				}
			},
			{field: 'remark', title: '备注', width: '100px', align: 'left'}
        ]],
		onLoadSuccess:function(data){
			gridHandel.setDatagridHeader("center");
		}
    });
}


//查询要货单
function queryForm(){
	$("#deliverType").val('DA');
	var fromObjStr = $('#queryForm').serializeObject();
	$("#deliverFormList").datagrid("options").method = "post";
	$("#deliverFormList").datagrid('options').url = contextPath + '/form/deliverReport/getDaForms';
	$("#deliverFormList").datagrid('load', fromObjStr);
}

/**
 * 发货机构
 */
/*function selectSourceBranches(){
	new publicAgencyService(function(data){
        if($("#sourceBranchId").val()!=data.branchesId){
            $("#sourceBranchId").val(data.branchesId);
            $("#sourceBranchName").val(data.branchName);
            gridHandel.setLoadData([$.extend({},gridDefault)]);
        }
	},'DA',$("#targetBranchId").val());
}*/

/**
 * 收货机构
 */
/*function selectTargetBranches(){
	var targetBranchType = $("#targetBranchType").val();
	if(targetBranchType != '0' && targetBranchType != '1'){
		return;
	}
	new publicAgencyService(function(data){
        $("#targetBranchId").val(data.branchesId);
        $("#targetBranchName").val(data.branchName);
	},'DA','');
}*/

/**
 * 查询机构
 */
var branchId;
var brancheType;
function selectBranches(){
	new publicAgencyService(function(data){
        if($("#branchId").val()!=data.branchesId){
            $("#branchId").val(data.branchesId);
            $("#branchName").val(data.branchName);
        }
	},'',branchId);
}

/**
 * 重置
 */
var resetForm = function() {
	 $("#queryForm").form('clear');
	 $("#deliverType").val('DA');
};

/**
 * 导出
 */
function exportData(){
	var length = $('#deliverFormList').datagrid('getData').rows.length;
	if(length == 0){
		successTip("无数据可导");
		return;
	}
	if(length>10000){
		successTip("当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	
	var fromObjStr = $('#queryForm').serializeObject();
	$("#queryForm").form({
		success : function(result){
			//successTip(result);
		}
	});
	$("#queryForm").attr("action",contextPath+'/form/deliverReport/exportList')
	$("#queryForm").submit();
}



