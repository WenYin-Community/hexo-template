---
title: "野兽先辈计算器.cpp"
date: 2022-02-26
categories:
  - "文化杂谈"
tags: 
  - "cpp"
  - "野兽先辈"
---

```cpp
// ConsoleApplication4.cpp: 定义控制台应用程序的入口点。
//

#include "stdafx.h"
using namespace std;

int a, num = 0;
bool start(char *s, int a);
bool END; //找到符合要求的式子的标记
//预留三个括号位
#define DIGIT_1 3
#define DIGIT_2 11
#define DIGIT_3 19
#define DIGIT_4 27
#define DIGIT_5 35
#define DIGIT_6 43

#define NEGATIVE 126 //126表示负数
bool operator_flag[5] = {};
char expression[47] = {}; //表达式数组，0表示缺省
char operator_list[4] = { '+','-','*','^' }; //运算符种类
array <char, 5> pre_list_tmp;
vector <array<char, 5>> pre_list; //全部运算符排列的列表
vector <int> bracket_set; //括号标记
vector <vector<int>> bracket_list; //全部括号列表
map <long long, bool> flag; //枚举状态标记，用于去重
void init() {
    memset(expression, 0, sizeof(expression));
    flag.clear();
    END = false;
    expression[DIGIT_1] = '1';
    expression[DIGIT_2] = '1';
    expression[DIGIT_3] = '4';
    expression[DIGIT_4] = '5';
    expression[DIGIT_5] = '1';
    expression[DIGIT_6] = '4';
}
void operator_add(int);
void bracket_add(int);
void bracket_add_1();
//void bracket_add_2(int);
//void bracket_add_3(int);
void calculate();

int d_pow(int a, int b); //整数乘方函数

int main() {
    operator_add(0);
    bracket_add(0);
    while (cin >> a)
    {
        init();
        bracket_add_1();
        if (END)
            continue;
        expression[DIGIT_1] = NEGATIVE; //把第一个数变为负数
        flag.clear();
        bracket_add_1();
        if (!END)
            cout << "Can not find!" << num << endl;
    }
    return 0;
}

void operator_add(int x) {
    bool flag = true;
    for (int i = 0; i < 5 && flag; i++)
    {
        if (!operator_flag[i])
            flag = false;
    }
    if (flag) {
        pre_list.push_back(pre_list_tmp);
        return;
    }
    operator_flag[x] = true;
    for (int i = 0; i < 4; i++)
    {
        pre_list_tmp[x] = operator_list[i];
        operator_add(x + 1);
    }
    operator_flag[x] = false;
}

void bracket_add(int x) {
    if (x > 7) { //可插入括号的位置总数。
        return;
    }
    if (bracket_set.size() == 2) {
        vector <int> tmp;
        switch (bracket_set[0])
        {
        case 0:
            tmp.push_back(DIGIT_1);
            break;
        case 1:
            tmp.push_back(DIGIT_2);
            break;
        case 2:
            tmp.push_back(DIGIT_3);
            break;
        case 3:
            tmp.push_back(DIGIT_4);
            break;
        case 4:
            tmp.push_back(DIGIT_5);
            break;
        case 5:
            tmp.push_back(DIGIT_6);
            break;
        }
        switch (bracket_set[1])
        {
        case 1:
            tmp.push_back(DIGIT_1);
            break;
        case 2:
            tmp.push_back(DIGIT_2);
            break;
        case 3:
            tmp.push_back(DIGIT_3);
            break;
        case 4:
            tmp.push_back(DIGIT_4);
            break;
        case 5:
            tmp.push_back(DIGIT_5);
            break;
        case 6:
            tmp.push_back(DIGIT_6);
            break;
        }
        bracket_list.push_back(tmp);
        return;
    }
    bracket_set.push_back(x);
    bracket_add(x + 1);
    bracket_set.pop_back();
    bracket_add(x + 1);
}

void bracket_add_1() {
    int size = 21; //21 is bracket_list.size()
    for (int i = 0; i < size; i++)
    {
        int sum = 0;
        /*
        *去重思路:左右括号各有6个可能出现的位置，每个位置出现的括号最多为2个，
        *因此用一个至少12位的十进制整数来储存状态，把每个括号的位置的信息储存在
        *十进制位之中。
        */
        sum += d_pow(10, 6 + (bracket_list[i][0] - 3) / 8);
        sum += d_pow(10, (bracket_list[i][1] - 3) / 8);
        expression[bracket_list[i][0] - 1] = '(';
        expression[bracket_list[i][1] + 1] = ')';
        for (int j = 0; j < size; j++)
        {
            sum += d_pow(10, 6 + (bracket_list[j][0] - 3) / 8);
            sum += d_pow(10, (bracket_list[j][1] - 3) / 8);
            expression[bracket_list[j][0] - 2] = '(';
            expression[bracket_list[j][1] + 2] = ')';
            if (!flag[sum]) {
                flag[sum] = true;
                calculate();
            }
            if (END)
                return;
            expression[bracket_list[j][0] - 2] = 0;
            expression[bracket_list[j][1] + 2] = 0;
        }
        expression[bracket_list[i][0] - 1] = 0;
        expression[bracket_list[i][1] + 1] = 0;
    }
}

void calculate() {
    int size = pre_list.size();
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            switch (j)
            {
            case 0:
                expression[DIGIT_1 + 4] = pre_list[i][j];
                break;
            case 1:
                expression[DIGIT_2 + 4] = pre_list[i][j];
                break;
            case 2:
                expression[DIGIT_3 + 4] = pre_list[i][j];
                break;
            case 3:
                expression[DIGIT_4 + 4] = pre_list[i][j];
                break;
            case 4:
                expression[DIGIT_5 + 4] = pre_list[i][j];
                break;
            }
        }
        /*string input;
        for (int j = 0; j < 47; j++)
        {
            if (expression[j])
                input.push_back(expression[j]);
        }*/
        //计算器接口
        END = start(expression, a);
        num++;
        if (END)
            return;
    }
}
```
