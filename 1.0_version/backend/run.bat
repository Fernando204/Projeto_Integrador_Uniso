@echo off
set JAVA_HOME=%~dp0jdk-21.0.10+7
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME=%JAVA_HOME%
javac -version

mvnw.cmd spring-boot:run