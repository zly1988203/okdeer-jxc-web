/**
 *@Copyright: Copyright ©2005-2020 http://www.okdeer.com/ Inc. All rights reserved
 *@Project: okdeer-jxc-web
 *@Package: com.okdeer.jxc.controller.message
 *@Author: songwj
 *@Date: 2017年3月31日 上午9:49:28
 *注意：本内容仅限于友门鹿公司内部传阅，禁止外泄以及用于其他的商业目的
 */

package com.okdeer.jxc.controller.message;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.dubbo.config.annotation.Reference;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.message.service.MessageService;
import com.okdeer.jxc.utils.UserUtil;

/**
 * @ClassName: MessageController
 * @Description: 在线消息提醒
 * @project okdeer-jxc-web
 * @author songwj
 * @date 2017年3月31日 上午9:49:28
 * =================================================================================================
 *     Task ID	         Date		  Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *     V2.5         	2017年3月31日		  songwj		在线消息提醒 
 */
@Controller
@RestController
@RequestMapping("message")
public class MessageController {

	private static Map<String, String> permissions = Maps.newLinkedHashMap();

	@Reference(version = "1.0.0", check = false)
	private MessageService messageService;

	@PostConstruct
	private void init() {

		permissions.put("JxcStockException:search", "JxcStockException");

		permissions.put("JxcPurchaseReceipt:search", "JxcPurchaseReceipt");

		permissions.put("JxcDeliverDI:search", "JxcDeliverDI");

		// 调价单审核权限
		permissions.put("JxcPriceAdjust:audit", "jxcPriceAdjust");
		// 领用单权限
		permissions.put("JxcStockLead:audit", "jxcStockLead");
		// 门店调价单
		permissions.put("JxcBranchPriceAdjust:audit", "jxcBranchPriceAdjust");
		// 组合拆分单
		permissions.put("JxcCombineSplit:audit", "jxcCombineSplit");
		// 采购订单
		permissions.put("JxcPurchaseOrder:audit", "jxcPurchaseOrder");
		// 活动管理
		permissions.put("activityList:audit", "activityList");
		// 采购收货
		permissions.put("JxcPurchaseReceipt:audit", "jxcPurchaseReceipt");
		// 新品审核
		permissions.put("JxcNewGoodsApply:audit", "jxcNewGoodsApply");
		// 采购退货
		permissions.put("JxcPurchaseRefund:audit", "jxcPurchaseRefund");
		// 要货申请
		permissions.put("JxcDeliverDA:audit", "jxcDeliverDA");
		// 成本调价单
		permissions.put("JxcCostAdjust:audit", "jxcCostAdjust");
		// 退货申请
		permissions.put("JxcDeliverDR:audit", "jxcDeliverDR");
		// 报损单
		permissions.put("JxcStockReimburse:audit", "jxcStockReimburse");
		// 配送入库
		permissions.put("JxcDeliverDI:audit", "jxcDeliverDI");
		// 配送出库
		permissions.put("JxcDeliverDO:audit", "jxcDeliverDO");
		// 商品调价单
		permissions.put("JxcOverdueApply:audit", "jxcOverdueApply");
		// 店间配送
		permissions.put("JxcDeliverDD:audit", "jxcDeliverDD");
		// 库存调整单
		permissions.put("JxcStockAdjust:audit", "jxcStockAdjust");
		
		//供应商预付款单
		permissions.put("JxcSupplierAdvance:audit", "jxcSupplierAdvance");
		//供应商费用单
		permissions.put("JxcSupplierCharge:audit", "jxcSupplierCharge");
		//联营账款单
		permissions.put("JxcSupplierChain:audit", "jxcSupplierChain");
		//供应商对账单
		permissions.put("JxcSupplierCheck:audit", "jxcSupplierCheck");
		//供应商结算单
		permissions.put("JxcSupplierSettle:audit", "jxcSupplierSettle");
		//供应商往来账款
		permissions.put("JxcSupplierAc:export", "jxcSupplierAc");

		//加盟店预收款单
		permissions.put("JxcFranchiseAdvance:audit", "jxcFranchiseAdvance");
		//加盟店费用单
		permissions.put("JxcFranchiseCharge:audit", "jxcFranchiseCharge");
		//加盟店结算单
		permissions.put("JxcFranchiseSettle:audit", "jxcFranchiseSettle");
		//加盟店往来账款
		permissions.put("JxcFranchiseAc:export", "jxcFranchiseAc");

		//公告
		permissions.put("jxcSystemNotice:view", "jxcSystemNotice");

	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public RespJson allCount() {

		Map<String, Object> map = Maps.newHashMap();
		for (Map.Entry<String, String> entry : permissions.entrySet()) {
			if (isPermitted(entry.getKey())) {
				map.put(entry.getValue(), Boolean.TRUE);
			} else {
				map.put(entry.getValue(), Boolean.FALSE);
			}
		}
		map.put("branchId", UserUtil.getCurrBranchId());
		map.put("branchCompleCode", UserUtil.getCurrBranchCompleCode());
		map.put("startTime", LocalDate.now().minus(30, ChronoUnit.DAYS)
				.format(DateTimeFormatter.ofPattern(DateUtils.DATE_SMALL_STR_R)) + " 00:00:00");
		map.put("endTime",
				LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_SMALL_STR_R)) + " 23:59:59");
		map.put("userId",  UserUtil.getCurrentUser().getId());
		int allCount = messageService.countAllMessage(map);
		RespJson respJson = RespJson.success();
		respJson.setData(allCount);
		return respJson;
	}

	@RequestMapping(value = "/details", method = RequestMethod.GET)
	public RespJson detailsCount() {
		RespJson respJson = RespJson.success();
		Map<String, Object> params = Maps.newHashMap();
		Map<String, Boolean> map = Maps.newHashMap();
		List<String> list = Lists.newArrayList();
		for (Map.Entry<String, String> entry : permissions.entrySet()) {
			if (isPermitted(entry.getKey())) {
				map.put(entry.getValue(), Boolean.TRUE);
				list.add(entry.getValue());
			} else {
				map.put(entry.getValue(), Boolean.FALSE);
			}
		}
		params.putAll(map);
		params.put("branchId", UserUtil.getCurrBranchId());
		params.put("branchCompleCode", UserUtil.getCurrBranchCompleCode());
		params.put("startTime", LocalDate.now().minus(30, ChronoUnit.DAYS)
				.format(DateTimeFormatter.ofPattern(DateUtils.DATE_SMALL_STR_R)) + " 00:00:00");
		params.put("endTime",
				LocalDate.now().format(DateTimeFormatter.ofPattern(DateUtils.DATE_SMALL_STR_R)) + " 23:59:59");
		params.put("userId",  UserUtil.getCurrentUser().getId());
		List<Integer> detailsCount = messageService.countDetailsMessage(params);
		Map<String, Integer> datas = Maps.newHashMap();
		Integer allCount = Integer.valueOf(0);
		Integer sumOne = Integer.valueOf(0);
		Integer sumTwo = Integer.valueOf(0);
		Integer sumThree = Integer.valueOf(0);
		if(detailsCount==null || detailsCount.isEmpty()){
			datas.put("sumOne", sumOne);
			datas.put("sumTwo", sumTwo);
			datas.put("sumThree", sumThree);
			datas.put("allCount", allCount);
			datas.put("sumOther", Integer.valueOf(0));
			for (String str:list) {
				datas.put(str, Integer.valueOf(0));
			}
			respJson.setData(datas);
			return respJson;
		}

		boolean isJxcStockException = map.get("JxcStockException") == null ? Boolean.FALSE
				: map.get("JxcStockException");
		if (isJxcStockException) {
			for (int i = 0; i < detailsCount.size() - 1; ++i) {
				datas.put(list.get(i), detailsCount.get(i)==null?Integer.valueOf(0):detailsCount.get(i));
				allCount += detailsCount.get(i)==null?Integer.valueOf(0):detailsCount.get(i);
			}
			datas.put("sumOne", detailsCount.get(0));
			sumOne = detailsCount.get(0);
		} else {
			for (int i = 1; i < detailsCount.size() - 1; ++i) {
				datas.put(list.get(i - 1), detailsCount.get(i)==null?Integer.valueOf(0):detailsCount.get(i));
				allCount += detailsCount.get(i)==null?Integer.valueOf(0):detailsCount.get(i);
			}
			datas.put("sumOne", 0);
		}
		boolean isJxcPurchaseReceipt = map.get("JxcPurchaseReceipt") == null ? Boolean.FALSE
				: map.get("JxcPurchaseReceipt");
		boolean isJxcDeliverDI = map.get("JxcDeliverDI") == null ? Boolean.FALSE : map.get("JxcDeliverDI");

		if (map.get("JxcPurchaseReceipt") != null || map.get("JxcDeliverDI") != null) {
			int one = 0;
			int two = 0;
			if (isJxcPurchaseReceipt) {
				one = detailsCount.get(1);
			}
			if (isJxcPurchaseReceipt && isJxcDeliverDI) {
				two = detailsCount.get(2);
			} else {
				two = detailsCount.get(1);
			}
			datas.put("sumTwo", one + two);
			
			sumTwo = one + two;
		} else {
			datas.put("sumTwo", 0);
		}
		
		if(map.get("jxcSystemNotice") != null){
			if (map.get("jxcSystemNotice")){
				datas.put("sumThree", detailsCount.get(detailsCount.size()-2));
				sumThree = detailsCount.get(detailsCount.size()-2);
			}
		}else{
			datas.put("sumThree", 0);
		}
		
		datas.put("sumOther", allCount - sumOne - sumTwo - sumThree);
		respJson.setData(datas);
		return respJson;
	}

	private Subject getSubject() {
		return SecurityUtils.getSubject();
	}

	private boolean isPermitted(String p) {
		return getSubject() != null && getSubject().isPermitted(p);
	}
}
