
var gridName = "gridDirectList";

$(function(){
	initConditionParams();
	initDirectDatagrid();
	changeStatus();
})

//初始化默认条件
function initConditionParams(){
    
	$("#txtStartDate").val(dateUtil.getPreMonthDate("prev",1).format("yyyy-MM-dd"));
	$("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
}


//单据状态切换
function changeStatus(){
	$(".radioItem").change(function(){
  	query();
  });
}


var gridHandel = new GridClass();

function query(){
	var oldBranchName = $("#oldBranchName").val();
	var branchName = $("#branchName").val();
	if(oldBranchName && oldBranchName != branchName){
		$("#branchId").val('');
		$("#branchCompleCode").val('');
	}
	
	var oldUserName = $("#oldUserName").val();
	var operateUserName = $("#operateUserName").val();
	if(oldUserName && oldUserName != operateUserName){
		$("#salesmanId").val('');
		$("#operateUserName").val('');
	}
	
	var oldsupplierName = $("#oldsupplierName").val();
	var supplierName = $("#supplierName").val();
	if(oldsupplierName && oldsupplierName != supplierName){
		$("#supplierId").val('');
		$("#supplierName").val('');
	}
	
	$("#"+gridName).datagrid("options").queryParams = $("#queryForm").serializeObject();
	$("#"+gridName).datagrid("options").method = "post";
	$("#"+gridName).datagrid("options").url = contextPath+'/directReceipt/getList';
	$("#"+gridName).datagrid("load");
}

//收货机构
function selectBranch(){
    new publicBranchService(function(data){
        $("#branchId").val(data.branchesId);
        $("#branchName").val("["+data.branchCode+"]"+data.branchName);
    },0);
}

//制单人
function selectOperator(){
    new publicOperatorService(function(data){
        $("#salesmanId").val(data.id);
        $("#operateUserName").val(data.userName);
    });
}

//选择供应商
function selectSupplier(){
    new publicSupplierService(function(data){
        $("#supplierId").val(data.id);
        $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);
        $("#deliverTime").val(new Date(new Date().getTime() + 24*60*60*1000*data.diliveCycle).format('yyyy-MM-dd'));
    });
}

//新增直送收货单
function directAdd(){
		toAddTab("新增直送收货单",contextPath + "/directReceipt/add");
}

//删除直送收货单 批量
function directDelete(){
	var rows = $("#"+gridName).datagrid("getChecked");
	if($("#"+gridName).datagrid("getChecked").length <= 0){
		 $.messager.alert('提示','请选中一行进行删除！');
		return null;
	}
	
    var formIds = [];
	var flag = true;
	rows.forEach(function(data,index){
		var status = data.status;
    	if(status == 0){
    		formIds.push(data.id);
	   		flag = false;
    	}
	});
    if(flag){
    	messager('已经审核的单据不可以删除！');
    	return;
    }
	
	$.messager.confirm('提示','是否要删除选中数据',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/directReceipt/delete",
		    	type:"POST",
		    	data:{
		    		formIds:formIds
		    	},
		    	success:function(result){
		    		console.log(result);
		    		if(result['code'] == 0){
		    			successTip("删除成功");
		    		}else{
		    			successTip(result['message']);
		    		}
		    		$("#"+gridName).datagrid('reload');
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}


function initDirectDatagrid(){
	gridHandel.setGridName("gridDirectReceipt");
    $("#"+gridName).datagrid({

        method:'post',
        align:'center',

        singleSelect:false,  //单选  false多选
        rownumbers:true,    //序号
        pagination:true,    //分页
        showFooter:true,
		height:'100%',
		width:'100%',
        columns:[[
            {field:'check',checkbox:true},
            {field:'formNo',title:'单据编号',width:'140px',align:'left',formatter:function(value,row,index){
            	var strHtml = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'直送收货单详细\',\''+contextPath+'/directReceipt/edit?formId='+row.id+'\')">' + value + '</a>';
            	return strHtml;
            }},
            {field:'status',title:'审核状态',width:'100px',align:'center',formatter:function(value,row,index){
            	if(value == '0'){
            		return '待审核';
            	}else if(value == '1'){
            		return '审核通过';
            	}else if(value == '2'){
            		return '审核失败';
            	}else{
            		return '未知类型：'+ value;
            	}
            }},
            {field:'branchCode',title:'机构编号',width:'120px',align:'left'},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'supplierName',title:'供应商',width:'140px',align:'left'},
   
            {field:'updateUserName',title:'制单人',width:'130px',align:'left'},
            {field:'createTime',title:'制单时间',width:'150px',align:'center', formatter: function (value, row, index) {
                if (value) {
                	return new Date(value).format('yyyy-MM-dd hh:mm');
                }
                return "";
            }},
            {field:'validUserName',title:'审核人',width:'130px',align:'left'},
            {field:'remark',title:'备注',width:'200px',align:'left'}
        ]],
		onLoadSuccess : function() {
			gridHandel.setDatagridHeader("center");
		}
    });
    query();
}

