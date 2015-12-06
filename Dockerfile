FROM khanghoang/express4-es6:0.0.3

WORKDIR /home/data/express4-es6
RUN git config --global user.email "hoangtrieukhang@gmail.com"
RUN git config --global user.name "Khang Hoang"

RUN git stash
RUN git pull --rebase origin master

RUN gulp babel

# Run App
EXPOSE 3000
CMD ["node", "dist/server.js"]
