<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okdeer.jxc.utils.UserUtil" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>出库单-编辑</title>

    <%@ include file="/WEB-INF/views/include/header.jsp"%>
	<script src="${ctx}/static/js/views/deliver/DDView.js?V=${versionNo}"></script>
    <script src="${ctx}/static/js/views/deliver/deliverExport.js?V=${versionNo}"></script>
    <%@ include file="/WEB-INF/views/component/publicPrintChoose.jsp"%>
</head>
<body class="ub uw uh ufs-14 uc-black">
    <div class="ub ub-ver ub-f1 umar-4  ubor">
        <div class="ub ub-ac upad-4">
            <div class="ubtns">
            	<shiro:hasPermission name="JxcDeliverDD:append">
            		<div class="ubtns-item" onclick="addDeliverForm()">新增</div>
            	</shiro:hasPermission>
               <div class="ubtns-item-disabled">保存</div>
               
               	<div class="ubtns-item-disabled">审核</div>
               	<!--如果有引用单号说明已经被处理了，不能终止-->
               	<c:if test="${form.referenceNo==null }">
                	
                	 <c:choose>
			      		<c:when test="${form.dealStatus eq '终止'}">
			      		<div class="ubtns-item-disabled">终止</div>
			      		</c:when>
				       <c:otherwise>
				      <div class="ubtns-item" onclick="toEnd()">终止</div>
				       </c:otherwise>
					</c:choose>
                	
                </c:if>
                	<c:if test="${form.referenceNo!=null }">
                	<div class="ubtns-item-disabled" >终止</div>
                </c:if>
                <div class="ubtns-item-disabled" >商品选择</div>
                <div class="ubtns-item-disabled" >导入货号</div>
            	<div class="ubtns-item-disabled" >导入条码</div>
            	<div class="ubtns-item"  onclick="exportData('DD','gridEditRequireOrder')">导出</div>
            	<shiro:hasPermission name="JxcDeliverDD:print">
                    <div class="ubtns-item" onclick="printChoose('DD','/form/deliverForm/')">打印</div>
                </shiro:hasPermission>
                <div class="ubtns-item" onclick="toClose()">关闭</div>
            </div>
        </div>
       
         <div class="ub umar-t8 uc-black">【单号】:<span>${form.formNo}</span></div>
         
         <c:choose>
      		<c:when test="${form.dealStatus eq '终止'}">
      		<div class="already-examine" id="already-examine"><span>已终止</span></div>
      		</c:when>
	       <c:otherwise>
	       <div class="already-examine" id="already-examine"><span>已审核</span></div>
	       </c:otherwise>
		</c:choose>
        
        <div class="ub uline umar-t8"></div>
        <div class="ub">
               <div class="ub ub-ac uw-300">
               		<input type="hidden" id="formId" value="${form.deliverFormId}">
               	   <input type="hidden" id="formNo" value="${form.formNo}">
                   <div class="umar-r10 uw-70 ut-r">要货机构:</div>
                   <div class="ub">
                       <input type="hidden" id="targetBranchId" name="targetBranchId" value="${form.targetBranchId}"  />
                      <%--  <input type="hidden" id="targetBranchType" name="targetBranchType" value="${form.targetBranchType}"  /> --%>
                       <input class="uinp ub ub-f1" type="text" id="targetBranchName" name="targetBranchName" value="${form.targetBranchName}" readonly="readonly" />
                   </div>

               </div>
               <div class="ub ub-ac uw-300 umar-l20">
                   <div class="umar-r10 uw-70 ut-r">制单人员:</div>
                   <div class="utxt">${form.createUserName}</div>
               </div>
               <div class="ub ub-ac uw-300 umar-l20">
                   <div class="umar-r10 uw-70 ut-r">制单时间:</div>
                   <div class="utxt" id="createTime"><fmt:formatDate value="${form.createTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
               <!--  <div class="ub ub-ac uw-300 umar-l20">
                <div class="umar-r10 uw-70 ut-r">联系人:</div>
                <div class="utxt" id="contacts"></div>
                </div> -->
           </div>
            <div class="ub umar-t8">
               <div class="ub ub-ac uw-300">
                   <div class="umar-r10 uw-70 ut-r">发货机构:</div>
                   <div class="ub">
                    <input type="hidden" id="formType" name="formType" value="${form.formType}" />
                       <input type="hidden" id="sourceBranchId" name="sourceBranchId" value="${form.sourceBranchId}" />
                        <input type="hidden" id="sourceBranchType" name="sourceBranchType" value="${form.sourceBranchType}"  />
                       <input class="uinp ub ub-f1" type="text" id="sourceBranchName" name="sourceBranchName" value="${form.sourceBranchName}" readonly="readonly" />
                   </div>
               </div>


  				<div class="ub ub-ac umar-l20 uw-300">
                   <div class="umar-r10 uw-70 ut-r">修改人员:</div>
                   <div class="utxt" id="validUserName">${form.updateUserName}</div>
                   <div class="utxt"></div>
               </div>
               <div class="ub ub-ac umar-l20 uw-300">
                   <div class="umar-r10 uw-70 ut-r">修改时间:</div>
                   <div class="utxt" id="validUserName">  <fmt:formatDate value="${form.updateTime}" pattern="yyyy-MM-dd HH:mm"/></div>
                   <div class="utxt"></div>
               </div>
               
           </div>
           <div class="ub umar-t8">
           	  
                <div class="ub ub-ac uw-300 umar">
                    <div class="umar-r10 uw-70 ut-r">备注:</div>
                    <input class="uinp" type="text" readonly="readonly" id="remark" name="remark" value="${form.remark}" >
                </div>
                <div class="ub ub-ac uw-300 umar-l20">
                   <div class="umar-r10 uw-70 ut-r">审核人员:</div>
                   <div class="utxt" id="validUserName">${form.validUserName}</div>
               </div>
               <div class="ub ub-ac uw-300 umar-l20">
                   <div class="umar-r10 uw-70 ut-r">审核时间:</div>
                   <div class="utxt"><fmt:formatDate value="${form.validTime}" pattern="yyyy-MM-dd HH:mm"/></div>
               </div>
           </div>
           <%--datagrid-edit--%>
           <div class="ub ub-f1 datagrid-edit umar-t8">
               <table id="gridEditRequireOrder" ></table>
           </div>
    </div>
</body>
</html>