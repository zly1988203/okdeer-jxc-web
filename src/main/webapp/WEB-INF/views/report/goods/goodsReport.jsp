<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>商品档案</title>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="${ctx}/static/js/views/report/goods/goodsReport.js"></script>
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
		<form id="queryForm" method="post">
			<div class="ub ub-ac">
				<div class="ubtns">
					<div class="ubtns-item" onclick="query()">查询</div>
					<div class="ubtns-item" onclick="printReport()">打印</div>
					<div class="ubtns-item" onclick="exportExcel()">导出</div>
					<div class="ubtns-item" onclick="toClose()">关闭</div>
					<div class="ubtns-item" onclick="resetFrom()">重置</div>
				</div>
			</div>
			
			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r"><span class="umust"></span>机构:</div>
					<input type="hidden" name="branchId" id="branchId" class="uinp" value="${branchesGrow.branchesId}"/>
					<input type="text" name="branchName" id="branchName" class="uinp" readonly="readonly" value="${branchesGrow.branchName}" />
					<div class="uinp-more" onclick="searchBranch()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">类别:</div>
					<input type="hidden" name="categoryCode" id="categoryCode" class="uinp" />
					<input type="text" name="categoryName" id="categoryName" class="uinp"  readonly="readonly" />
					<div class="uinp-more" onclick="searchCategory()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">品牌:</div>
					<input type="hidden" name="brandId" id="brandId" class="uinp" />
					<input type="text" name="brandName" id="brandName" class="uinp"  readonly="readonly" />
					<div class="uinp-more" onclick="searchBind()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">供应商:</div>
					<input type="hidden" name="supplierId" id="supplierId" class="uinp" />
					<input type="text" name="supplierName" id="supplierName" class="uinp" readonly="readonly" />
					<div class="uinp-more" onclick="searchSupplier()">...</div>
					
				</div>
			</div>

			<div class="ub umar-t8">
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">货号:</div>
					<input type="text" name="skuCode" id="skuCode" class="uinp" />
					<div class="uinp-more" onclick="selectSkuCode()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">条码:</div>
					<input type="text" name="barCode" id="barCode" class="uinp" />
					<div class="uinp-more" onclick="selectBarCode()">...</div>
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">零售价:</div>
					<select style="height: 32px;" name="operater" id="operater">
							<option value="0">等于</option>
							<option value="1">大于</option>
							<option value="2">大于等于</option>
							<option value="3">小于</option>
							<option value="4">小于等于</option>
					</select> 
					<input type="text" name="operaterNum" id="operaterNum" class="uinp" style="width: 116px;" />
				</div>
				<div class="ub ub-ac umar-r40">
					<div class="umar-r10 uw-60 ut-r">助记码:</div>
					<input type="text" name="memoryCode" id="memoryCode" class="uinp" />
				</div>
				
			</div>
		</form>
		 <div class="ub umar-t8">&nbsp;</div>
		 <div class="ub ub-f1">
		 	<table id="goodsTab"></table>
		 </div>
		
	</div>



	
</body>
</html>