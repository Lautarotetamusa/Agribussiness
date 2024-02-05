CREATE TABLE Chats(
    id INT NOT NULL AUTO_INCREMENT,
    cliente CHAR(10) NOT NULL,
    colaborador CHAR(10) NOT NULL,

    FOREIGN KEY (cliente) REFERENCES Personas(cedula),
    FOREIGN KEY (colaborador) REFERENCES Personas(cedula),
    UNIQUE (cliente, colaborador),
    PRIMARY KEY (id)
);

ALTER TABLE Chats
    RENAME COLUMN cliente TO persona_1,
    RENAME COLUMN colaborador TO persona_2;

CREATE TABLE Messages(
    id INT NOT NULL AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender CHAR(10) NOT NULL,
    message VARCHAR(1024) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (chat_id) REFERENCES Chats(id),
    FOREIGN KEY (sender) REFERENCES Personas(cedula),
    PRIMARY KEY (id)
);

DELIMITER //

CREATE PROCEDURE InsertMessage(
    IN p_chat_id INT,
    IN p_sender CHAR(10),
    IN p_message VARCHAR(1024)
)
BEGIN
    DECLARE is_valid_sender INT;

    -- Verificar si el remitente está dentro del chat
    SELECT COUNT(*) INTO is_valid_sender
    FROM Chats
    WHERE id = p_chat_id AND (cliente = p_sender OR colaborador = p_sender);

    -- Insertar el mensaje solo si el remitente está en el chat
    IF is_valid_sender > 0 THEN
        INSERT INTO Messages (chat_id, sender, message, created_at)
        VALUES (p_chat_id, p_sender, p_message, CURRENT_TIMESTAMP);
    END IF;
END //

DELIMITER ;


/*  TESTS */ 
INSERT INTO Chats(cliente, colaborador) VALUES ("2043491978", "348213906");
/* Si lo hago dos  veces me da duplicated key i-> OK */

/* insertar un mensaje en un chat */
/* esto debería andar */
CALL InsertMessage(1, "2043491978", 'Hola muy buenos días');

/* esto no debería andar */
CALL InsertMessage(1, "99999999999", 'Hola muy buenos días');
