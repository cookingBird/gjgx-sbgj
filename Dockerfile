# 基础镜像
FROM nginx
# 复制文件到Nginx路径
COPY ./dist  /usr/share/nginx/html/
#默认端口
EXPOSE 80