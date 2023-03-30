import request from '@/utils/request';

//获取标签表格数据
export const getTagTableData = (data) => {
  return request({
    url: "/module/getTags",
    method: "POST",
    data
  })
}

//标签新增
export const addTag = (data) => {
  return request({
    url: "/module/addTag",
    method: "POST",
    data
  })
}

//标签删除
export const deleteTag = (params) => {
  return request({
    url: "/module/deleteTag",
    method: "GET",
    params
  })
}

//获取标签下拉
export const getTagOptionApi = () => {
  return request({
    url: "/module/getList",
    method: "GET"
  })
}