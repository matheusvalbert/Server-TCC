CREATE TABLE `ambientes` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `nome_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `history` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `date` varchar(45) NOT NULL,
  `number` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `listas` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `ids` varchar(45) DEFAULT NULL,
  `number` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `moradores` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `plate` varchar(45) DEFAULT NULL,
  `img_name` varchar(500) NOT NULL,
  `number` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `img_name_UNIQUE` (`img_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `notificacao` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `type` varchar(45) NOT NULL,
  `notification` varchar(45) DEFAULT NULL,
  `visitor` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `reserva_ambientes` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `ambiente_uid` int NOT NULL,
  `lista_uid` int NOT NULL,
  `date` varchar(45) NOT NULL,
  UNIQUE KEY `uid_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `users` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `number` varchar(45) DEFAULT '-1',
  `token` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `visitantes` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `plate` varchar(45) DEFAULT NULL,
  `img_name` varchar(500) NOT NULL,
  `number` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `img_name_UNIQUE` (`img_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `visitantesNotificacao` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `date` varchar(45) NOT NULL,
  `authorized` varchar(45) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `visitas` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `visitantes_uid` int NOT NULL,
  `type` varchar(45) NOT NULL,
  `text` varchar(45) NOT NULL,
  `number` varchar(45) NOT NULL,
  `date` date DEFAULT NULL,
  `seg` tinyint DEFAULT NULL,
  `ter` tinyint DEFAULT NULL,
  `qua` tinyint DEFAULT NULL,
  `qui` tinyint DEFAULT NULL,
  `sex` tinyint DEFAULT NULL,
  `sab` tinyint DEFAULT NULL,
  `dom` tinyint DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  KEY `uid_idx` (`visitantes_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
