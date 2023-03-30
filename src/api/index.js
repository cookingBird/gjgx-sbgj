import request from '@/utils/request';

//新增组件
export const componentAdd = (data) => {
  return request({
    url: "/module/add",
    method: "POST",
    data
  })
}

//修改组件
export const componentUpdate = (data) => {
  return request({
    url: "/module/update",
    method: "POST",
    data
  })
}

//组件库分页查询
export const getComponentsListApi = (data) => {
  return request({
    url: "/module/getModuleLists",
    method: "POST",
    data
  })
}

//删除组件
export const componentDelete = (params) => {
  return request({
    url: "/module/delete",
    method: "GET",
    params
  })
}

//获取组织机构
export const getOrgOption = () => {
  return request({
    url: "/module/getOrgCode",
    method: "GET",

  })
}

//获取页面配置
export const getPageConfig = (params) => {
  return request({
    url: "/page/getPage",
    method: "GET",
    params
  })
}

//保存页面配置
export const savePageConfig = (data) => {
  return request({
    url: "/page/add",
    method: "POST",
    data
  })
}

//组织机构查询列表
export const getOrgTableData = (data) => {
  return request({
    url: '/module/page',
    method: 'POST',
    data
  })
}

//获取页面列表
export const getPageList = (data) => {
  return request({
    url: '/page/queryAllocation',
    method: 'POST',
    data
  })
}

//页面配置新增/修改
export const addAllocation = (data) => {
  return request({
    url: '/page/addAllocation',
    method: 'POST',
    data
  })
}

//页面状态、默认状态修改
export const updatePageFlag = (params) => {
  return request({
    url: '/page/updateFlag',
    method: 'GET',
    params
  })
}

//删除页面
export const deletePageById = (params) => {
  return request({
    url: '/page/deleteById',
    method: 'GET',
    params
  })
}