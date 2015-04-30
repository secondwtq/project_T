Pragmatic RESTful API design

错误处理

Facebook Twilio 和 SimpleGeo 的不同策略：

* Facebook：always 200，错误信息在 payload 里面。

* Twilio：会给出对应的状态码，同时有详细的错误信息，相关网址。

* SimpleGeo：有错误码，但是 payload 比较简单。

在设计 REST API 的错误处理策略时，可以使用 HTTP 状态码，一共有 70+ 个，但是我们常用几个就行了。同时在 payload 中注明错误码和相应信息。

三个基本状态：200 - 没事，404 等 - 调用者犯错误了，500 - 服务器出问题了。

剩下还有几个可以用：201 - Created，304 - Not Modified，400 - Bad Request，401 - Unauthorized，403 - Forbidden。

[RESTful API Design: what about errors?](https://blog.apigee.com/detail/restful_api_design_what_about_errors)