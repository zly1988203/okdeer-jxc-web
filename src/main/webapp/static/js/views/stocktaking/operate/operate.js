/**
 * 库存盘货单
 */
var gridName = "operateGrid";
var isdisabled = false;
var url;
var operateStatus = 'add';

$(function(){
	operateStatus = $('#operateStatus').val();
	var formId = $('#formId').val();
	if(operateStatus === 'add'){
	
	}else if(operateStatus === '0'){
		url = contextPath +"/stocktaking/operate/stocktakingFormDetailList?formId=" + formId;
		$('#already-examine').css('display','none');
		$('#btnCheck').css('display','black');
	
	}else if(operateStatus === '1'){
		url = contextPath +"/stocktaking/operate/stocktakingFormDetailList?formId=" + formId;
		isdisabled = true;
		$('#already-examine').css('display','black');
		$('#btnCheck').css('display','none');
	}
	initOperateDataGrid();
 }
)

var gridHandel = new GridClass();
function initOperateDataGrid(){
	 gridHandel.setGridName(gridName);
	    gridHandel.initKey({
	        firstName:'skuCode',
	        enterName:'skuCode',
	        enterCallBack:function(arg){
	            if(arg&&arg=="add"){
	                gridHandel.addRow(parseInt(gridHandel.getSelectRowIndex())+1,gridDefault);
	                setTimeout(function(){
	                    gridHandel.setBeginRow(gridHandel.getSelectRowIndex()+1);
	                    gridHandel.setSelectFieldName("skuCode");
	                    gridHandel.setFieldFocus(gridHandel.getFieldTarget('skuCode'));
	                },100)
	            }else{
	            	branchId = $("#sourceBranchId").val();
	                selectGoods(arg);
	            }
	        },
	    })
	    
	    $("#"+gridName).datagrid({
        method:'get',
    	url:url,
        align:'center',
        singleSelect:false,  // 单选 false多选
        rownumbers:true,    // 序号
        showFooter:true,
        height:'100%',
        width:'100%',
        columns:[[
			{field:'ck',checkbox:true},
			{field:'cz',title:'操作',width:'60px',align:'center',
			    formatter : function(value, row,index) {
			        var str = "";
			        if(row.isFooter){
			            str ='<div class="ub ub-pc">合计</div> '
			        }else{
			            str =  '<a name="add" class="add-line" data-index="'+index+'" onclick="addLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>&nbsp;&nbsp;' +
			                '&nbsp;&nbsp;<a name="del" class="del-line" data-index="'+index+'" onclick="delLineHandel(event)" style="cursor:pointer;display:inline-block;text-decoration:none;"></a>';
			        }
			        return str;
			    }
			},
            {field:'rowNo',hidden:'true'},
            {field:'skuId',hidden:'true'},
            {field:'barCode',hidden:'true'},
            {field:'skuCode',title:'货号',width: '70px',align:'left',
            	editor:{
	                type:'textbox',
	                options:{
	                	disabled:isdisabled,
	                }
            	}
            },
            {field:'skuName',title:'商品名称',width:'200px',align:'left'},

            {field:'unit',title:'单位',width:'60px',align:'left'},
            {field:'spec',title:'规格',width:'90px',align:'left'},
            {field:'spec',title:'品牌',width:'90px',align:'left'},

            {field:'stocktakingNum',title:'实际盘点数量',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }
                    if(!value){
                        row["stocktakingNum"] = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                },
                editor:{
                    type:'numberbox',
                    options:{
                    	disabled:isdisabled,
                        min:0,
                        precision:4,
                    }
                }
            },
            {field:'price',title:'零售价',width:'80px',align:'right',
                formatter:function(value,row,index){
                    if(row.isFooter){
                        return
                    }
                    if(!row.price){
                    	row.price = parseFloat(value||0).toFixed(2);
                    }
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            
            },
            {field:'amount',title:'零售金额',width:'80px',align:'right',
                formatter : function(value, row, index) {
                    if(row.isFooter){
                        return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                    }

                    if(!row.amount){
                    	row.amount = parseFloat(value||0).toFixed(2);
                    }
                    
                    return '<b>'+parseFloat(value||0).toFixed(2)+'</b>';
                }
            }
        ]],
        onClickCell:function(rowIndex,field,value){
            gridHandel.setBeginRow(rowIndex);
            gridHandel.setSelectFieldName(field);
            var target = gridHandel.getFieldTarget(field);
            if(target){
                gridHandel.setFieldFocus(target);
            }else{
                gridHandel.setSelectFieldName("skuCode");
            }
        },
        onLoadSuccess:function(data){

            gridHandel.setDatagridHeader("center");
        
            updateFooter();
        },
    });
    
    if(operateStatus === 'add'){
    	 gridHandel.setLoadData([$.extend({},gridDefault),$.extend({},gridDefault),
    	                         $.extend({},gridDefault),$.extend({},gridDefault)]);
    }
}


// 合计
function updateFooter(){
    var fields = {largeNum:0,applyNum:0,amount:0,isGift:0, };
    var argWhere = {name:'isGift',value:0}
    gridHandel.updateFooter(fields,argWhere);
}

// 插入一行
function addLineHandel(event){
    event.stopPropagation(event);
    var index = $(event.target).attr('data-index')||0;
    gridHandel.addRow(index,gridDefault);
}
// 删除一行
function delLineHandel(event){
    event.stopPropagation();
    var index = $(event.target).attr('data-index');
    gridHandel.delRow(index);
}


// 选择商品
function selectGoods(searchKey){
	var branchId = $("#branchId").val();
	var sourceBranchId = branchId;
	var targetBranchId = branchId;
    if(branchId == ""){
        messager("请先选择机构");
        return;
    }
    //控制弹框
	if(typeof(searchKey)=="undefined"){ 
		searchKey = "";
	}
    
    var param = {
    		type:'',
    		key:searchKey,
    		isRadio:'',
    		branchId:branchId,
    		sourceBranchId:'',
    		targetBranchId:'',
    		supplierId:'',
    		flag:'0'
    }
    
    new publicGoodsServiceTem(param,function(data){
    	if(searchKey){
	        $("#"+gridName).datagrid("deleteRow", gridHandel.getSelectRowIndex());
	        $("#"+gridName).datagrid("acceptChanges");
	    }
    	
    	 var nowRows = gridHandel.getRowsWhere({skuCode:'1'});
         var addDefaultData  = gridHandel.addDefault(data,gridDefault);
         var keyNames = {
         		skuId:'goodsSkuId',
         		salePrice:'price'
         };
         var rows = gFunUpdateKey(addDefaultData,keyNames);
         var argWhere ={skuCode:1};  // 验证重复性
         var isCheck ={isGift:1 };   // 只要是赠品就可以重复
         var newRows = gridHandel.checkDatagrid(nowRows,rows,argWhere,isCheck);
         $("#"+gridName).datagrid("loadData",newRows);
    	
    	
        gridHandel.setLoadFocus();
        setTimeout(function(){
            gridHandel.setBeginRow(gridHandel.getSelectRowIndex()||0);
            gridHandel.setSelectFieldName("stocktakingNum");
            gridHandel.setFieldFocus(gridHandel.getFieldTarget('stocktakingNum'));
        },100)
    	
    });
    branchId = '';
}

// 导入
function toImportOperate(type){

    var takeStockId = $("#takeStockId").val();
    if(takeStockId === '' || takeStockId === null){
        messager("请先选择盘点批号");
        return;
    }
    var param = {
        url:contextPath+"/form/deliverForm/importList",
        tempUrl:contextPath+"/form/deliverForm/exportTemp",
        type:type,

    }
    new publicUploadFileService(function(data){
    	if (data.length != 0) {
    		selectStockAndPriceImport(data);
    	}
    },param)
}

function searchTakeStock(){
	var branchId = $('#branchId').val();
	var param = {
			branchId:branchId
	}
	new publicStocktakingDialog(param,function(data){
		console.log(data);
		$("#branchId").val(data.branchId);
		$("#branchName").val(data.branchName);
		$("#batchId").val(data.id);
		$("#batchNo").val(data.batchNo);
		$("#scope").val(data.scope==1 ? "类别盘点" : "全场盘点");
		$("#categoryShows").val(data.categoryShowsStr);
	})
}

function saveStocktakingForm(opType){
	var branchId = $("#branchId").val();
	var batchId = $("#batchId").val();
	var batchNo = $("#batchNo").val();
	if(!branchId || !$.trim(branchId)){
		messager("请选择机构");
		return;
	}
	if(!batchId || !$.trim(batchId)){
		messager("请选择盘点批次");
		return;
	}
    $("#"+datagridId).datagrid("endEdit", gridHandel.getSelectRowIndex());
    var rows = gridHandel.getRowsWhere({skuName:'1'});
    $(gridHandel.getGridName()).datagrid("loadData",rows);
    if(rows.length==0){
        messager("表格不能为空");
        return;
    }
    var isCheckResult = true;
    var isChcekPrice = false;
    
    $.each(rows,function(i,v){
        if(parseFloat(v["stocktakingNum"])<=0){
            isChcekPrice = true;
        }
    });
    if(isCheckResult){
        if(isChcekPrice){
            $.messager.confirm('系统提示',"盘点数存在为0，是否确定保存",function(r){
                if (r){
                    saveDataHandel(rows,opType);
                }
            });
        }else{
            saveDataHandel(rows,opType);
        }
    }
}

function saveDataHandel(rows,opType){
	//机构
	var formId=$("#formId").val();
    //机构
    var branchId=$("#branchId").val();
    //机构Code
    var branchCode=$("#branchCode").val();
    //批次ID
    var batchId=$("#batchId").val();
    //批次号
    var batchNo=$("#batchNo").val();
    // 备注
    var remark = $("#remark").val();

			
    var tempRows = [];
    // 商品明细
    $.each(rows,function(i,data){
        var temp = {
			skuId:data.skuId,
			skuCode:data.skuCode,
			skuName:data.skuName,
			barCode:data.barCode,
			unit:data.unit,
			spec:data.spec,
			stocktakingNum:data.stocktakingNum
        }
        tempRows.push(temp);
    });
    var jsonData = {
    		id:formId,
			branchId:branchId,
			branchCode:branchCode,
			batchId:batchId,
			batchNo:batchNo,
			remark:remark,
			mode:0,
			terminalId:'',
			operateType:opType,
            detailList:tempRows
        };
    console.log('盘点单',JSON.stringify(jsonData));
    $.ajax({
        url:contextPath+"/stocktaking/operate/saveStocktakingForm",
        type:"POST",
        data:{"data":JSON.stringify(jsonData)},
        success:function(result){
        	console.log('result',result);
            if(result['code'] == 0){
    			$.messager.alert("操作提示", "操作成功！", "info",function(){
    				location.href = contextPath +"/stocktaking/operate/stocktakingFormView?id="+result['formId'];
    			});
            }else{
                successTip(result['message']);
            }
        },
        error:function(result){
            successTip("请求发送失败或服务器处理失败");
        }
    });
}

/**
 * 机构名称
 */
function selectBranches(){
	new publicAgencyService(function(data){
		$("#branchId").val(data.branchesId);
		$("#branchCode").val(data.branchCode);
		$("#branchName").val(data.branchName);
	},'BF','');
}
