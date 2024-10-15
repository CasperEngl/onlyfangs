-- Create enum tables for race and class
CREATE TABLE races (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Create admin table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create player table
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    invite_code VARCHAR(255) UNIQUE,
    race_id INT,
    class_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (created_by) REFERENCES admins(id)
) ENGINE=InnoDB;

-- Insert World of Warcraft Classic races
INSERT INTO races (name, slug) VALUES
    ('Human', 'human'),
    ('Dwarf', 'dwarf'),
    ('Night Elf', 'night-elf'),
    ('Gnome', 'gnome'),
    ('Orc', 'orc'),
    ('Undead', 'undead'),
    ('Tauren', 'tauren'),
    ('Troll', 'troll');

-- Insert World of Warcraft Classic classes
INSERT INTO classes (name, slug) VALUES
    ('Warrior', 'warrior'),
    ('Paladin', 'paladin'),
    ('Hunter', 'hunter'),
    ('Rogue', 'rogue'),
    ('Priest', 'priest'),
    ('Shaman', 'shaman'),
    ('Mage', 'mage'),
    ('Warlock', 'warlock'),
    ('Druid', 'druid');
