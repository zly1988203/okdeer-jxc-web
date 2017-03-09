<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>采购向导——采购订单列表</title>
    
    <%@ include file="/WEB-INF/views/include/header.jsp"%>
    
</head>
<body class="ub uw uh ufs-14 uc-black">
	<div class="ub ub-ver ub-f1 umar-4 upad-4">
	
	<div class="ub ub-ac upad-4">
        <div class="ubtns umar-l20 umar-t10">
        	<div class="ubtns-item" onclick="chekData()">审核</div>
        	<div class="ubtns-item" onclick="delData()">删除</div>
        	<div class="ubtns-item" onclick="finish()">完成</div>
        </div>
        	<div class="umar-l50 divMsg">
        		
        	</div>
    </div>
    
		<input type="hidden" name="formData" id="formData" value='${formData }' />

		<div class="ub umar-t8 ub-f1">
			<table id="dgGuideOrderList"></table>
		</div>

	</div>
</body>
</html>