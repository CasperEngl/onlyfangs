-- Create enum tables for race and class
CREATE TABLE
    races (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE
    classes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE
    );

-- Create admin table
CREATE TABLE
    admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create invite_codes table
CREATE TABLE
    invite_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255) NOT NULL UNIQUE,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP NULL,
        FOREIGN KEY (created_by) REFERENCES admins (id)
    );

-- Create player table
CREATE TABLE
    players (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        invite_code_id INT REFERENCES invite_codes(id),
        race_id INT REFERENCES races(id),
        class_id INT REFERENCES classes(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Insert World of Warcraft Classic races
INSERT INTO
    races (name, slug)
VALUES
    ('Human', 'human'),
    ('Dwarf', 'dwarf'),
    ('Night Elf', 'night-elf'),
    ('Gnome', 'gnome'),
    ('Orc', 'orc'),
    ('Undead', 'undead'),
    ('Tauren', 'tauren'),
    ('Troll', 'troll');

-- Insert World of Warcraft Classic classes
INSERT INTO
    classes (name, slug)
VALUES
    ('Warrior', 'warrior'),
    ('Paladin', 'paladin'),
    ('Hunter', 'hunter'),
    ('Rogue', 'rogue'),
    ('Priest', 'priest'),
    ('Shaman', 'shaman'),
    ('Mage', 'mage'),
    ('Warlock', 'warlock'),
    ('Druid', 'druid');
