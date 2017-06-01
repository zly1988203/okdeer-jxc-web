/**
 * Created by 
 * 供应商对账单-新增 修改
 */


var gridDefault = {
		
	}
//列表数据查询url
var url = "";
var oldData = {};
var gridName = "supplierChkAccountAdd";
var pageStatus;
var editRowData = null;
var targetBranchId;


$(function(){
    pageStatus = $('#operateType').val();

    $('#payType').combobox({
		editable:false,
		valueField:'id',
		textField: 'label',
		value:_comboV,
		url:contextPath + '/archive/financeCode/getDictListByTypeCode?dictTypeCode=101003',
		loadFilter:function(data){
			if(pageStatus === 'add'){
				data[0].selected = true
			}
			return data;
		}
	})
	
	if(pageStatus === 'add'){
		
	}else if(pageStatus === 'edit'){
		var formId = $("#formId").val();
		url = contextPath+"/settle/supplierCheck/checkFormDetailList?id="+formId;
		oldData = {
		        remark:$("#remark").val(),                  // 备注
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
        firstName:'discountAmount',
    })

    $("#"+gridName).datagrid({
        method:'post',
    	url:url,
        align:'center',
        singleSelect:false,  //单选  false多选
        checkOnSelect:false,
        rownumbers:true,    //序号
        showFooter:true,
        height:"100%",
        width:'100%',
        columns:[[
            {field:'cb',checkbox:true},
            {field:'targetFormId',title:'targetFormId',hidden:true},
            {field:'targetFormNo',title:'单号',width: '150px',align:'left',
            	formatter:function(value,row,index){
            		if(row.isFooter){
            			return  '<div class="ub ub-pc">合计</div> '
                    }
            		return value ;
            	}
            },
            {field:'targetFormType',title:'单据类型',width:'120px',align:'center'},
            {field:'branchCode',title:'机构编号',width:'120px',align:'left'},
            {field:'branchName',title:'机构名称',width:'140px',align:'left'},
            {field:'supplierCode',title:'供应商编号',width:'120px',align:'left'},
            {field:'supplierName',title:'供应商名称',width:'140px',align:'left'},
            {field:'payableAmount',title:'应付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.payableAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
            },
            {field:'discountAmount',title:'优惠金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.discountAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	},
            	editor:{
            		type:'numberbox',
            		options:{
            			min:0,
            			precision:4,
            			onChange:changeDisAmount
            		}
            	}
            },
            {field:'unpayAmount',title:'未付金额',width:'100px',align:'right',
            	formatter:function(value,row,index){
            		if(!value)row.unpayAmount = 0;
            		return '<b>'+parseFloat(value||0).toFixed(2)+'</b>'
            	}
//            	,editor:{
//            		type:'numberbox',
//            		options:{
//            			min:0,
//            			precision:4,
//            		}
//            	}
            },
            {field:'remark',title:'备注',width:'180px',editor:'textbox'}
        ]],
        onCheck:function(rowIndex,rowData){
        	rowData.checked = true;
        },
        onUncheck:function(rowIndex,rowData){
        	rowData.checked = false;
        },
        onCheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.checked = true;
        	})
        },
        onUncheckAll:function(rows){
        	$.each(rows,function(index,item){
        		item.checked = false;
        	})
        },
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("discountAmount");
            }
        },
        loadFilter:function(data){
        	data.forEach(function(obj,index){
        		obj.checked = true;
        		if(pageStatus == 'add'){
        			obj.unpayAmount = obj.payableAmount;
        		}
        	});
        	return data;
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


//修改优惠金额
function changeDisAmount(vewV,oldV){
	
	var _payableAmount = parseFloat(gridHandel.getFieldData(gridHandel.getSelectRowIndex(),'payableAmount')||0);
	if(vewV > _payableAmount){
		$_jxc.alert('优惠金额不能大于应付金额');
		$(this).numberbox('setValue',oldV);
		return ;
	}
	
	gridHandel.setFieldsData({unpayAmount:_payableAmount - vewV});
	
	updateFooter()
}
//合计
function updateFooter(){
    var fields = {payableAmount:0,discountAmount:0,unpayAmount:0};
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
function saveSupChkForm(){
	var branchId = $('#branchId').val();
	var supplierId = $('#supplierId').val();
	var operateType = $('#operateType').val();
	if(!validateForm(branchId,supplierId))return;
	
    var reqObj = $('#checkForm').serializeObject();
    reqObj.operateType = operateType == "add" ? 1 : 0;
    var _rows = gridHandel.getRowsWhere({targetFormNo:'1'});
    if(_rows.length <= 0){
    	$_jxc.alert("表格不能为空");
    	return;
    }
    
    var _subRows = [];
    var _rowNo = 0;//行号
    $.each(_rows,function(i,data){
    	if(data.checked){
    		data.rowNo = _rowNo;
    		data.checked = data.checked ? 1:0;
    		_subRows.push(data);
    		_rowNo++;
    	}
    })
    
    reqObj.detailList = _subRows;
    
    console.log('reqObj',reqObj);
//    return;
    $_jxc.ajax({
    	url:contextPath + '/settle/supplierCheck/saveCheckForm',
    	data:{"data":JSON.stringify(reqObj)}
    },function(result){
    	console.log('result',result)
    	if(result['code'] == 0){
			$_jxc.alert("操作成功！",function(){
				location.href = contextPath +"/settle/supplierCheck/checkEdit?id="+result['formId'];
			});
        }else{
            $_jxc.alert(result['message']);
        }
    })
}

//审核
function auditSupChkForm(){
    //验证数据是否修改
    $("#"+gridName).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var newData = {
        remark:$("#remark").val(),                  // 备注
        grid:$.map(gridHandel.getRows(), function(obj){
            return $.extend(true,{},obj);//返回对象的深拷贝
        })
    }

    if(!gFunComparisonArray(oldData,newData)){
    	$_jxc.alert("数据有修改，请先保存再审核");
        return;
    }
    var reqObj = {
    	id:$('#formId').val()||'',
    	branchId:$('#branchId').val()||''
    }
	$_jxc.confirm('是否审核通过？',function(data){
		if(data){
			$_jxc.ajax({
		    	url : contextPath+"/settle/supplierCheck/auditCheckForm",
		    	data:{"data":JSON.stringify(reqObj)}
		    },function(result){
	    		if(result['code'] == 0){
	    			$_jxc.alert("操作成功！",function(){
	    				location.href = contextPath +"/settle/supplierCheck/checkView?id=" + result["formId"];
	    			});
	    		}else{
	            	 $_jxc.alert(result['message'],'审核失败');
	    		}
		    } );
		}
	});
}

//删除
function delSupChkAccount(){
	var ids = [];
	ids.push($("#formId").val());
	$_jxc.confirm('是否要删除单据',function(data){
		if(data){
			$_jxc.ajax({
		    	url:contextPath+"/settle/supplierCheck/deleteCheckForm",
		    	contentType:"application/json",
		    	data:{"ids":ids}
		    },function(result){
	    		if(result['code'] == 0){
                    toRefreshIframeDataGrid("settle/supplierCheck/getCheckList","supperlierChkAccount");
	    			toClose();
	    		}else{
	    			$_jxc.alert(result['message']);
	    		}
		    });
		}
	});
}

//机构
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchCode").val(data.branchCode);
		$("#targetBranchName").val("["+data.branchCode+"]"+data.branchName);
	},'',targetBranchId);
}

//选择供应商
function selectSupplier(){
    new publicSupplierService(function(data){
    	console.log(data);
    	$("#phone").val(data.phone);
    	$("#mobile").val(data.mobile);
    	$('#linkTel').val((data.mobile?data.mobile:'')+(data.phone?'/'+data.phone:''));//联系人
    	
    	$("#supplierId").val(data.id);
        $("#supplierName").val("["+data.supplierCode+"]"+data.supplierName);	
        // 设置供应商扩展信息
        setSupplierExtValue(data.id);
        //初始化列表
        initCheckFormDetail();
    });
}

//设置供应商扩展信息
function setSupplierExtValue(supplierId){
	$_jxc.ajax({
		url : contextPath + "/common/supplier/getSupplierExtById",
		data : {
			supplierId : supplierId
		}
	},function(data){
    	//开户银行
    	$('#openAccountBank').val((data.supplierExt.openAccountBank?data.supplierExt.openAccountBank:''));
    	//银行账户
    	$('#bankAccount').val((data.supplierExt.bankAccount?data.supplierExt.bankAccount:''));
    	//办公地址
    	$('#officeAddress').val((data.supplierExt.officeAddress?data.supplierExt.officeAddress:''));
    	//国税登记
    	$('#nationalTaxRegNum').val((data.supplierExt.nationalTaxRegNum?data.supplierExt.nationalTaxRegNum:''));
	});
}


function validateForm(branchId,supplierId){
    if(!$.trim(branchId)){
    	$_jxc.alert('请选择机构!');
    	return false;
    }
    if(!supplierId){
    	$_jxc.alert('请选择供应商!');
    	return false;
    }
    return true;
}
//初始化列表
function initCheckFormDetail(){
    var branchId = $('#branchId').val();
	var supplierId = $('#supplierId').val();
	var operateType = $('#operateType').val();
	if(!validateForm(branchId,supplierId))return;
    var paramsObj = {
    	branchId:branchId,
		operateType : operateType == 'add' ? 1 : 2,
    	supplierId:supplierId
    }
    console.log('paramsObj:',paramsObj);
	$("#"+gridName).datagrid("options").method = "post";
    $("#"+gridName).datagrid("options").queryParams = paramsObj;
	$("#"+gridName).datagrid('options').url = contextPath + '/settle/supplierCheck/checkFormDetailList';
	$("#"+gridName).datagrid('load');
}

//返回列表页面
function back(){
	location.href = contextPath+"/settle/supplierCheck/checkList";
}

//新增供应商对账单
function addSupChkForm(){
	toAddTab("新增供应商对账单",contextPath + "/settle/supplierCheck/checkAdd");
}
