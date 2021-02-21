--creating database;
CREATE DATABASE foodfy;

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

ALTER TABLE "recipes" 
ADD FOREIGN KEY ("chef_id") 
REFERENCES "chefs" ("id")
ON DELETE CASCADE;

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
