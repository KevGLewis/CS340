
-- Project Creation SQL


CREATE TABLE employee (
    eid INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    hourly_rate FLOAT,
    fk_officeID INT,
    PRIMARY KEY(eid),
    CONSTRAINT fl_employee UNIQUE (first_name, last_name),
    FOREIGN KEY (fk_officeID) REFERENCES office(id)
) ENGINE=InnoDB


CREATE TABLE office (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    zipcode INT,
    PRIMARY KEY(id),
    UNIQUE (name)
) ENGINE=InnoDB

CREATE TABLE bridge (
    id  INT AUTO_INCREMENT NOT NULL,
    length INT,
    type varchar(255),
    zipcode INT NOT NULL,
    spans INT,
    NBI_ID INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (NBI_ID)
) ENGINE=InnoDB

CREATE TABLE LOA (
    id INT AUTO_INCREMENT NOT NULL,
    number INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (number)
) ENGINE=InnoDB

CREATE TABLE inspection (
    insp_id INT AUTO_INCREMENT NOT NULL,
    type varchar(255),
    budget FLOAT NOT NULL,
    pcomp INT,
    fk_bridgeID INT NOT NULL,
    fk_LOA_num INT NOT NULL,
    PRIMARY KEY (insp_id),
    FOREIGN KEY (fk_bridgeID) REFERENCES bridge(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_LOA_num) REFERENCES LOA(id)
) ENGINE=InnoDB

CREATE TABLE report (
    rep_id INT AUTO_INCREMENT NOT NULL,
    type varchar(255),
    budget FLOAT NOT NULL,
    pcomp INT,
    fk_bridgeID INT NOT NULL,
    fk_LOA_num INT NOT NULL,
    PRIMARY KEY (rep_id),
    FOREIGN KEY (fk_bridgeID) REFERENCES bridge(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_LOA_num) REFERENCES LOA(id)
) ENGINE=InnoDB

CREATE TABLE insp_assign(
    eid int NOT NULL,
    insp_id int NOT NULL,
    hours_worked int,
    PRIMARY KEY (eid, insp_id),
    FOREIGN KEY (eid) REFERENCES employee(eid),
    FOREIGN KEY (insp_id) REFERENCES inspection(insp_id)
) ENGINE=InnoDB

CREATE TABLE rep_assign(
    eid int NOT NULL,
    rep_id int NOT NULL,
    hours_worked int,
    PRIMARY KEY (eid, rep_id),
    FOREIGN KEY (eid) REFERENCES employee(eid),
    FOREIGN KEY (rep_id) REFERENCES report(rep_id)
) ENGINE=InnoDB





