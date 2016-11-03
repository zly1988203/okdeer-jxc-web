/**
 * Created by wxl on 2016/08/17.
 */
var pageSize = 50;
$(function(){
    //开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));

    //初始化列表
    initCashWaterGrid();
});
var gridHandel = new GridClass();
function initCashWaterGrid() {
    $("#cashWater").datagrid({
        //title:'普通表单-用键盘操作',
        method: 'post',
        align: 'center',
        url: "",
        //toolbar: '#tb',     //工具栏 id为tb
        singleSelect: false,  //单选  false多选
        rownumbers: true,    //序号
        pagination: true,    //分页
        //fitColumns:true,    //占满
        showFooter:true,
        pageSize : pageSize,
        height:'100%',
        columns: [[
            {field: 'branchCode', title: '店铺编号', width: 100, align: 'left'},
            {field: 'branchName', title: '店铺名称', width: 200, align: 'left'},
            {field: 'orderNo', title: '单据编号', width: 180, align: 'left'},
            {field: 'saleTime', title: '销售时间', width: 150, align: 'left',formatter : function(saleTime){
    			if(saleTime){
    				var now = new Date(saleTime);
    				var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
    				return nowStr;
    			}
    			return null;
    		}},
            {field: 'saleAmount', title: '销售金额', width: 120, align: 'right',formatter : function(saleAmount){
    			if(saleAmount){
    				saleAmount = parseFloat(saleAmount);
    				return saleAmount.toFixed(2);
    			}
    			return null;
    		}},
            {field: 'businessType', title: '业务类型', width: 150, align: 'center',formatter : function(businessType){
    			if(businessType){
    				if(businessType =='A') {
    					return "销售";
    				}
    				if(businessType =='B') {
    					return "退货";
    				}
    			}
    			return null;
    		}},
            {field: 'payAmount', title: '付款金额', width: 120, align: 'right',formatter : function(payAmount){
    			if(payAmount){
    				payAmount = parseFloat(payAmount);
    				return payAmount.toFixed(2);
    			}
    			return null;
    		}},
            {field: 'payType', title: '付款方式', width: 100, align: 'center'},
            {field: 'cashier', title: '收银员', width: 100, align: 'left'},
            {field: 'returnOrderNo', title: '退货原单号', width: 100, align: 'left'},
            {field: 'orderType', title: '订单类型', width: 80, align: 'center',formatter : function(orderType){
    			if(orderType){
    				if(orderType =='0') {
    					return "APP";
    				}
    				if(orderType =='1') {
    					return "微信";
    				}
    				if(orderType =='2') {
    					return "POS订单";
    				}
    			}
    			return null;
    		}},
            {field: 'remark', title: '备注', width: 150, align: 'left'},
        ]]
    });
    gridHandel.setDatagridHeader("center");
}


//改变日期
function changeDate(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.getCurrentWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.getPreviousWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousWeek()[1].format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.getCurrentMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.getPreviousMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousMonth()[1].format("yyyy-MM-dd"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.getCurrentSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.getPreviousSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousSeason()[1].format("yyyy-MM-dd"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.getCurrentYear()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
}


/**
 * 机构列表下拉选
 */
function searchBranch (){
	new publicAgencyService(function(data){
		$("#branchCode").val(data.branchCode);
		$("#branchNameOrCode").val("["+data.branchCode+"]"+data.branchName);
	},"","");
}

/**
 * 收银员下拉选
 */
function searchCashierId(){
	new publicOperatorService(function(data){
		$("#cashierId").val(data.id);
		$("#cashierNameOrCode").val("["+data.userCode+"]"+data.userName);
	});
}


/**
 * 导出
 */
function exportExcel(){
	$("#queryForm").form({
		success : function(data){
			if(data.code > 0){
				$.messager.alert('提示',data.message);
			}
		}
	});
	
	var isValid = $("#queryForm").form('validate');
	if(!isValid){
		return;
	}
	
	var length = $("#cashWater").datagrid('getData').total;
	if(length == 0){
		$.messager.alert('提示',"无数据可导");
		return;
	}
	if(length>10000){
		$.messager.alert('提示',"当次导出数据不可超过1万条，现已超过，请重新调整导出范围！");
		return;
	}
	
	$("#queryForm").attr("action",contextPath+"/cashFlow/report/exportList");
	$("#queryForm").submit();
	
}

//查询
function query(){
	var formData = $("#queryForm").serializeObject();
	var branchNameOrCode = $("#branchNameOrCode").val();
	if(branchNameOrCode && branchNameOrCode.indexOf("[")>=0 && branchNameOrCode.indexOf("]")>=0){
		formData.branchNameOrCode = null;
	}
	var cashierNameOrCode = $("#cashierNameOrCode").val();
	if(cashierNameOrCode && cashierNameOrCode.indexOf("[")>=0 && cashierNameOrCode.indexOf("]")>=0){
		formData.cashierNameOrCode = null;
	}
	$("#cashWater").datagrid("options").queryParams = formData;
	$("#cashWater").datagrid("options").method = "post";
	$("#cashWater").datagrid("options").url = contextPath+'/cashFlow/report/getList';
	$("#cashWater").datagrid("load");
	
}

//合计
function updateFooter(){
    var fields = {saleAmount:0,payAmount:0};
    var argWhere = {name:'isGift',value:''}
    gridHandel.updateFooter(fields,argWhere);
}

//打印
function printReport(){
	//var queryType = $("input[name='queryType']").val();
	var startDate = $("#txtStartDate").val();
	var endDate = $("#txtEndDate").val();
	var branchId= $("#branchId").val();
	var businessType=$("#businessType").combobox("getValue");
	var orderNo=$("#orderNo").val();
	var payType=$("#payType").combobox("getValue");
	var orderType=$("#orderType").combobox("getValue");
	var statisType=$("#statisType").combobox("getValue");;
	var cashierId=$("#cashierId").val();
	parent.addTabPrint("reportPrint"+branchId,"打印",contextPath+"/cashFlow/report/printReport?" +"&startDate="+startDate
			+"&endDate="+endDate+"&branchId="+branchId+"&cashierId="+cashierId+"&businessType="+businessType+"&orderNo="
			+orderNo+"&payType="+payType+"&orderType="+orderType+"&statisType="+statisType);
}
/**
 * 重置
 */
var resetForm = function(){
	 $("#queryForm").form('clear');
	 $("#branchCode").val('');
};

function clearBranchCode(){
	var branchNameOrCode = $("#branchNameOrCode").val();
	
	//如果修改名称
	if(!branchNameOrCode || 
			(branchNameOrCode && branchNameOrCode.indexOf("[")<0 && branchNameOrCode.indexOf("]")<0)){
		$("#branchCode").val('');
	}
}

function clearCashierId() {
	var cashierNameOrCode = $("#cashierNameOrCode").val();

	// 如果修改名称
	if (!cashierNameOrCode || 
			(cashierNameOrCode && cashierNameOrCode.indexOf("[") < 0 && cashierNameOrCode.indexOf("]") < 0)) {
		$("#cashierId").val('');
	}
}