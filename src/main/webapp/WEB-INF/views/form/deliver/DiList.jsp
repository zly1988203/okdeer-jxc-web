<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>配送入库</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    <%-- <script  src="${ctx}/static/js/fun/publicComponent.js"></script> --%>
    <script  src="${ctx}/static/js/views/deliver/DiList.js"></script>
    
</head>
<body class="ub uw uh ufs-14 uc-black">

    <div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" action="" method="post">
			<div class="ub ub-ac">
	            <div class="ubtns">
	            	<shiro:hasPermission name="JxcDeliverDI:search">
						<div class="ubtns-item" onclick="queryForm()">查询</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:add">
						<div class="ubtns-item" onclick="addDeliverForm()">新增</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:delete">
						<div class="ubtns-item" onclick="delDeliverForm()">删单</div>
				   	</shiro:hasPermission>
	            	<shiro:hasPermission name="JxcDeliverDI:setting">
						<div class="ubtns-item">设置</div>
				   	</shiro:hasPermission>
				   	<div id="updatePermission" class="none">
						<shiro:hasPermission name="JxcDeliverDI:update" >修改</shiro:hasPermission>
					</div>
	                <div class="ubtns-item" id="set" onclick="gFunRefresh()" >重置</div>
	                <div class="ubtns-item" onclick="toClose()">退出</div>
	            </div>
	        	<div class="ub ub-ac umar-l20">
	        		<!-- 引入时间选择控件 -->
	            	<%@ include file="/WEB-INF/views/component/dateSelectHour.jsp"%>
	            </div>
			</div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac">
	                    <div class="umar-r10 uw-70 ut-r">单据编号:</div>
	                    <input type="hidden" id="deliverType" name="deliverType" value="DI" />
	                    <input class="uinp" type="text" id="formNo" name="formNo">
	                </div>
	                <div class="ub ub-ac uw-300 umar-l40">
	                    <div class="umar-r10 uw-70 ut-r">制单人:</div>
	                    <input type="hidden" id="operateUserId" name="operateUserId" />
	                    <input class="uinp ub ub-f1" type="text"  id="operateUserName" type="text" />
	                    <div class="uinp-more" onclick="selectOperator()">...</div>
	                </div>
	                <div class="ub ub-ac uw-300 umar-l40">
	                    <div class="umar-r10 uw-70 ut-r">发货机构:</div>
	                    <input type="hidden" id="sourceBranchId" name="sourceBranchId" value="${sourceBranchId}" />
	                    <input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName"  />
	                    <div class="uinp-more" onclick="selectBranches()" >...</div>
	                </div>
	            </div>
	            <div class="ub umar-t8">
	                <div class="ub ub-ac">
	                    <div class="umar-r10 uw-70 ut-r">备注:</div>
	                    <input class="uinp" type="text" id="remark" name="remark">
	                </div>
	                <!--input-checkbox-->
	                <div class="ub ub-ac umar-l40 uw-300">
	                    <div class="umar-r10 uw-70 ut-r">审核状态:</div>
	                    <div class="ub ub-ac umar-r10">
	                        <input class="ub" type="radio" name="deliverAuditStatus"  value="1"/><span>已审核</span>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
	                        <input class="ub" type="radio" name="deliverAuditStatus" value="0" checked="checked"/><span>未审核</span>
	                    </div>
	                    <div class="ub ub-ac umar-r10">
	                        <input class="ub" type="radio" name="deliverAuditStatus" value=""  /><span>全部</span>
	                    </div>
	                </div>
	            </div>
	        
       	</form>
        <div class="ub ub-f1  umar-t8 umar-b8">
			<table id="deliverFormList"></table>
		</div>
    </div>

</body>
</html>
