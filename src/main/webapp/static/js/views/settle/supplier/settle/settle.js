/**
 * Created by 
 * 供应商对账单-新增 修改
 */


var gridDefault = {
	    costPrice:0,
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "supplierChkAccountAdd";
var pageStatus;
var editRowData = null;
var targetBranchId;


$(function(){
    pageStatus = $('#pageStatus').val();
	if(pageStatus === 'add'){
		  $("#payMoneyTime").val(new Date().format('yyyy-MM-dd')); 
	}else if(pageStatus === 'edit'){
		var formId = $("#formId").val();
		url = contextPath+"/form/deliverFormList/getDeliverFormListsById?deliverFormId="+formId+"&deliverType=DA";
		oldData = {
		        targetBranchId:$("#targetBranchId").val(), // 要活分店id
		        remark:$("#remark").val(),                  // 备注
		        formNo:$("#formNo").val(),                 // 单号
		}
	    
	}
	initSupChkAcoAdd();
})

$(document).on('input','#remark',function(){
	var val=$(this).val();
	var str = val;
	   var str_length = 0;
	   var str_len = 0;
	      str_cut = new String();
	      str_len = str.length;
	      for(var i = 0;i<str_len;i++)
	     {
	        a = str.charAt(i);
	        str_length++;
	        if(escape(a).length > 4)
	        {
	         //中文字符的长度经编码之后大于4
	         str_length++;
	         }
	         str_cut = str_cut.concat(a);
	         if(str_length>200)
	         {
	        	 str_cut.substring(0,i)
	        	 remark.value = str_cut;
	        	 break;
	         }
	    }
	
});

var gridHandel = new GridClass();
function initSupChkAcoAdd(){
    gridHandel.setGridName(gridName);
    gridHandel.initKey({
        firstName:'costNo',
        enterName:'costNo'
    })

    $("#"+gridName).datagrid({
        method:'post',
    	url:url,
        align:'center',
        singleSelect:true,  //单选  false多选
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'cb',checkbox:true},
            {field:'orderNo',title:'单号',width: '150px',align:'left',
            	formatter:function(value,row,index){
            		var str = "";
            		if(row.isFooter){
                        str ='<div class="ub ub-pc">合计</div> '
                    }else{
                    	str = '<a style="text-decoration: underline;" href="#" onclick="toAddTab(\'供应商对账单据详情\',\''+ contextPath +'/form/deliverForm/deliverEdit?deliverFormId='+ row.deliverFormId +'&deliverType=DA\')">' + (value||"") + '</a>';
                    }
            		return str;
            	}
            },
            {field:'orderType',title:'单据类型',width:'120px',align:'left'},
            {field:'branchNo',title:'机构编号',width:'120px',align:'left'},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'supperNo',title:'供应商编号',width:'120px',align:'left'},
            {field:'supperName',title:'供应商名称',width:'140px',align:'left'},
            {field:'yfPrice',title:'应付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.yfPrice = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field:'yifPrice',title:'已付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.yifPrice = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field:'yhPrice',title:'优惠金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.yhPrice = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field:'wfPrice',title:'未付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.wfPrice = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field:'sfPrice',title:'实付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.sfPrice = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            		}
            	}
            },
            {field:'remark',title:'备注',width:'180px'}
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("yhPrice");
            }
        },
        onLoadSuccess:function(data){
        	if(pageStatus==='edit'){
                if(!oldData["grid"]){
                	oldData["grid"] = $.map(gridHandel.getRows(), function(obj){
                        return $.extend(true,{},obj);//返回对象的深拷贝
                    });

                }
        	}
            gridHandel.setDatagridHeader("center");
            updateFooter();
        },
    });
    
    if(pageStatus==='add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}

function onChangeAmount(vewV,oldV){
	updateFooter()
}
//合计
function updateFooter(){
    var fields = {amount:0};
    var argWhere = {}
    gridHandel.updateFooter(fields,argWhere);
}

//插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
//删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}



//保存
function saveSupAcoSet(){
    
}

//审核
function check(){
    
}

//删除
function delSupChkAccount(){
	var ids = [];
	ids.push($("#formId").val());
	$.messager.confirm('提示','是否要删除单据',function(data){
		if(data){
			$.ajax({
		    	url:contextPath+"/form/deliverForm/deleteDeliverForm",
		    	type:"POST",
		    	contentType:"application/json",
		    	data:JSON.stringify(ids),
		    	success:function(result){
		    		if(result['code'] == 0){
                        toRefreshIframeDataGrid("form/deliverForm/viewsDA","deliverFormList");
		    			toClose();
		    		}else{
		    			successTip(result['message']);
		    		}
		    	},
		    	error:function(result){
		    		successTip("请求发送失败或服务器处理失败");
		    	}
		    });
		}
	});
}

//机构
function selectBranches(){
	new publicAgencyService(function(data){
		$("#targetBranchId").val(data.branchesId);
		$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
	},'',targetBranchId);
}

//选择供应商
function selectSupplier(){
    new publicSupplierService(function(data){
    	console.log(data);
    	$('#tel').val(data.mobile+(data.phone?'/'+data.phone:''))
    	$("#supplierId").val(data.id);
        $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);	
        
    });
}

//选择费用
function selectCost(searchKey){
	var param = {
		key:searchKey,
	};
	publicCostService(param,function(data){
		console.log('data',data);
	});

}

//返回列表页面
function back(){
	location.href = contextPath+"/form/deliverForm/viewsDA";
}

//新增供应商对账单
function addSupAcoSetForm(){
	toAddTab("新增供应商结算",contextPath + "/settle/supplierSettle/settleAdd");
}