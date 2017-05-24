
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<title>一卡通提取</title>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script src="${ctx}/static/js/views/finance/iccard/icCardExtracted.js?V=1"></script>

<div class="ub ub-ver  ub-f1  uw uh ufs-14 uc-black">
	<div class="ub ub-ac upad-4">
		<div class="ubtns">
			<button class="ubtns-item" onclick="save()" id="saveBtn">保存</button>
			<button class="ubtns-item" onclick="closeExtractedDialog()">关闭</button>
		</div>
	</div>
	<div class="ub uline"></div>
	<form id="cardExtracted">
		<div class="ub ub-ver upad-4">
			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">提取店铺:</div>
					<input class="uinp uinp-no-more ub ub-f1" type="text" id="branchName"
						name="branchName" readOnly/>
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">当前余额:</div>
					<input class="uinp easyui-numberbox easyui-validatebox uinp-no-more" type="text"
							data-options="min:0.00,precision:2" id="oldBalance" name="oldBalance" readOnly/>
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">提取金额:</div>
					<input id="extractBalance" name="extractBalance" class="uinp easyui-numberbox easyui-validatebox"
					data-options="min:0.00,precision:2,onChange:changeBalance" type="text"/>
				</div>
				<i class="uc-red">*</i>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">提取方式:</div>
					<select class="uselect easyui-combobox" style="width: 204px;"
						data-options="editable:false" name="extractedType"
						id="extractedType">
						<option value="1">银行转账</option>
						<option value="2">微信转账</option>
						<option value="3">支付宝转账</option>
						<option value="4">现金</option>
						<option value="5">其他</option>
					</select>
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">提取后金额:</div>
					<input class="uinp easyui-numberbox easyui-validatebox uinp-no-more" type="text"
					data-options="min:0.00,precision:2" id="newBalance"
						name="newBalance" readOnly />
				</div>
			</div>

			<div class="ub upad-4 umar-t10">
				<div class="ub ub-ac">
					<div class="umar-r10 uw-70 ut-r">备注:</div>
					<input class="uinp ub ub-f1" type="text" id="remark" name="remark" maxlength="50"/>
				</div>
			</div>

		</div>
	</form>
</div>
