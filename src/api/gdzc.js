import request from '@/utils/service';
//单位管道汇总
export const pipe = ({ type, data }) => {
    return request({
        url: `pipe/${type}`,
        method: 'GET',
        params: data
    });
};
//管道基本信息
export const pipeInfo = (params) => {
    return request({
        url: `pipeInfo`,
        method: 'GET',
        params
    });
};

///管道名称列表
export const pipeNameList = (params) => {
    return request({
        url: `pipeNameList`,
        method: 'GET',
        params
    });
};

//管理职能管道汇总
export const pipelineSummary = (params) => {
    return request({
        url: `pipelineSummary`,
        method: 'GET',
        params
    });
};

