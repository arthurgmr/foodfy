--creating database;
CREATE DATABASE dbfoodfy;

--creating tables;
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "chef_id" int NOT NULL,
  "user_id" int NOT NULL,
  "featured" boolean,
  "homepage" boolean,
  "ingredients" text[] NOT NULL,
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "cpf" text NOT NULL,
  "phone" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "file_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

ALTER TABLE "recipe_files" 
ADD FOREIGN KEY ("recipe_id") 
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files" 
ADD FOREIGN KEY ("file_id") 
REFERENCES "files" ("id")
ON DELETE CASCADE;

ALTER TABLE "chefs" 
ADD FOREIGN KEY ("file_id") 
REFERENCES "files" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipes" 
ADD FOREIGN KEY ("user_id") 
REFERENCES "users" ("id")
ON DELETE CASCADE;

--table for req.session
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

--creating procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--trigger to auto updated_at in recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--trigger to auto updated_at in chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-------------------------------------

--to run seeds
DELETE FROM recipes;
DELETE FROM chefs;
DELETE FROM recipe_files;
DELETE FROM files;
DELETE FROM users;

--restart sequence auto_increment from tables ids
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
