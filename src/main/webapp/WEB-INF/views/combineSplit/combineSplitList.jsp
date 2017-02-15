<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>组合拆分单</title>
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%-- <script  src="${ctx}/static/js/fun/publicComponent.js"></script> --%>
    <script  src="${ctx}/static/js/views/combineSplit/combineSplitList.js"></script>
    <style>
    .datagrid-header .datagrid-cell {text-align: center!important;font-weight: bold;}
    </style>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 upad-8">
		<form action="" class="umar-t12" id="searchForm" method="post">
        <div class="ub ub-ac">
            <!--buttons-->
            <div class="ubtns">
                <div class="ubtns-item" onclick="modifyPriceOrderCx();">查询</div>
				<div class="ubtns-item" onclick="addCombineSplit();">新增</div>
	            <div class="ubtns-item" onclick="toCombineDetail();">详情</div>
	            <div class="ubtns-item" onclick="delModifyOrderDialog();">删单</div>
	            <div class="ubtns-item" onclick="window.parent.closeTab()">退出</div>
            </div>
			<div class="ub">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">日期:</div>
					<%@ include file="/WEB-INF/views/component/dateSelect.jsp"%>
				</div>
			</div>
        </div>
        <div class="ub umar-t8 uc-black"></div>
        <div class="ub uline umar-t8"></div>
        <div class="ub ub-ver ub-f1 ">
	            <div class="ub umar-t8">
	                <div class="ub ub-ac"> 
	                    <div class="umar-r10 uw-70 ut-r">单据编号:</div>
	                    <input class="uinp" name="formNo" type="text">
	                </div>
	                <div class="ub ub-ac uw-300 umar-l20">
	                    <div class="umar-r10 uw-70 ut-r">操作员:</div>
	                    <input class="uinp ub ub-f1" name="createUserId"  id="createUserId" type="hidden" >
	                    <input class="uinp ub ub-f1"  type="text"  id="createUserName">
	                    <div class="uinp-more" onclick="selectOperator();">...</div>
	                </div>
	                <div class="ub ub-ac uw-300 uma  r-l20">
	                    <div class="umar-r10 uw-70 ut-r" >机构:</div>
	                    <input class="uinp ub ub-f1" name="createBranchId" type="hidden" id="createBranchId" >
	                    <input class="uinp ub ub-f1"  type="text" id="createBranchName">
	                    <div class="uinp-more" onclick="selectBranch();">...</div>
	                </div>
	            </div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac uw-300">
	                    <div class="umar-r10 uw-70 ut-r">备注:</div>
	                    <input class="uinp ub" name="remark" type="text">
	                </div>
	                <!--input-checkbox-->
	                <div class="ub ub-ac umar-l10">
	                    <div class="umar-r10 uw-70 ut-r">审核状态:</div>
	                    <div class="ub ub-ac umar-r10">
	                         <label><input class="radioItem" type="radio" value="0" name="status" checked="checked"/><span>未审核</span></label>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
	                         <label><input class="radioItem" type="radio" value="1" name="status"/><span>审核</span></label>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
	                         <label><input class="radioItem"  type="radio" value="" name="status"/><span>全部</span></label>
	                    </div>
	                </div>
           		 </div>
        </div>
		</form>
		<div class="ub ub-f1 umar-t8 umar-b8">
			<table id="modifyPriceGrid"></table>
		</div>
    </div>
</body>
</html>
