<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>领用单-新增</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/stockLead/stockLeadAdd.js?V=${versionNo}"></script>
</head>
<body class="ub ub-ver uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4  ubor">
		<form action="" id="queryForm" method="post">
			<div class="ub ub-ac upad-4">
				<div class="ubtns">
					<shiro:hasPermission name="JxcStockLead:add">
						<div class="ubtns-item" onclick="addStockLead()">新增</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStockLead:add">
						<div class="ubtns-item" onclick="saveStockLead()">保存</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStockLead:audit">
						<div class="ubtns-item-disabled">审核</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="selectGoods()">商品选择</div>
					<shiro:hasPermission name="JxcStockLead:import">
						<div class="ubtns-item" onclick="importHandel(0)">导入货号</div>
						<div class="ubtns-item" onclick="importHandel(1)">导入条码</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStockLead:export">
						<div class="ubtns-item-disabled">导出</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStockLead:print">
						<div class="ubtns-item-disabled">打印</div>
					</shiro:hasPermission>
					<shiro:hasPermission name="JxcStockLead:setting">
						<div class="ubtns-item-disabled">设置</div>
					</shiro:hasPermission>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
				</div>
			</div>
			<div class="ub umar-t8 uline"></div>
			<div class="ub umar-t10">
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-70 ut-r">领用机构:</div>
					<input type="hidden" name="branchId" id="branchId" class="uinp" />
					<input type="text" name="branchName" id="branchName"class="uinp  ub ub-f1" readonly="readonly" />
					<div class="uinp-more" onclick="searchBranch()">...</div>
				</div>
				<div class="ub ub-ac uw-300 umar-l40">&nbsp;</div>
				<div class="ub ub-ac uw-300  umar-l40">
					<div class="umar-r10 uw-80 ut-r">制单人员:</div>
					<div class="utxt"><%=UserUtil.getCurrentUser().getUserName()%></div>
				</div>
				<div class="ub ub-ac umar-l10">
					<div class="umar-r10 uw-60 ut-r">制单时间:</div>
					<div class="utxt" id="createTime"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-600">&nbsp;</div>
				<div class="ub ub-ac uw-300 umar-l80">
					<div class="umar-r10 uw-80 ut-r">最后修改人:</div>
					<div class="utxt"></div>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-70 ut-r">修改时间:</div>
					<div class="utxt"></div>
				</div>
			</div>
			<div class="ub umar-t8">
				<div class="ub ub-ac uw-600">
					<div class="umar-r10 uw-70 ut-r">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark" name="remark">
				</div>
				<div class="ub ub-ac uw-300 umar-l80">
					<div class="umar-r10 uw-80 ut-r">审核人员:</div>
					<div class="utxt"></div>
				</div>
				<div class="ub ub-ac uw-300">
					<div class="umar-r10 uw-70 ut-r">审核时间:</div>
					<div class="utxt"></div>
				</div>
			</div>
		</form>
		<!--datagrid-edit-->
	<from id="gridFrom" class="ub ub-ver ub-f1 umar-t8">
	<table id="stockLeadAddForm" ></table>
	</from>

	</div>

</body>

</html>