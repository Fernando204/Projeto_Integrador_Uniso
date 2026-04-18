package com.example.backend.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger {

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("HH:mm:ss");

    // Cores ANSI
    private static final String RESET = "\u001B[0m";
    private static final String RED = "\u001B[91m";
    private static final String GREEN = "\u001B[92m";
    private static final String YELLOW = "\u001B[93m";
    private static final String CYAN = "\u001B[96m";
    private static final String PURPLE = "\u001B[95m";
    private static final String BOLD = "\033[1m";

    private static String time() {
        return LocalDateTime.now().format(formatter);
    }

    private static String caller() {
        StackTraceElement[] stack = Thread.currentThread().getStackTrace();
        return stack[3].getClassName();
    }

    public static void info(String msg) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + GREEN +
                "✔ [INFO] " + RESET +
                CYAN + time() + RESET +
                " [" + caller() + "] ➜ " +
                msg
        );
    }

    public static void warn(String msg) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + YELLOW +
                "⚠ [WARN] " + RESET +
                CYAN + time() + RESET +
                " [" + caller() + "] ➜ " +
                msg
        );
    }

    public static void error(String msg) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + RED +
                "✖ [ERROR] " + RESET +
                CYAN + time() + RESET +
                " [" + caller() + "] ➜ " +
                msg
        );
    }

    public static void debug(String msg) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + PURPLE +
                "🐞 [DEBUG] " + RESET +
                CYAN + time() + RESET +
                " [" + caller() + "] ➜ " +
                msg
        );
    }

    public static void success(String msg) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + GREEN +
                "🚀 [SUCCESS] " + RESET +
                CYAN + time() + RESET +
                " [" + caller() + "] ➜ " +
                msg
        );
    }

    public static void serverStarted(String url) {
        System.out.println("===========================================================================================================================================================================================================================================================");
        System.out.println(
                BOLD + GREEN +
                        "🌐 [SERVER ONLINE] " + RESET +
                        CYAN + time() + RESET +
                        " [" + caller() + "] ➜ " +
                        "Servidor iniciado em: " + BOLD + url + RESET
        );
    }
}