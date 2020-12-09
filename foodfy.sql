--creating database;
CREATE DATABASE foodfy;

--creating tables;
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "chef_id" int NOT NULL,
  "featured" text,
  "homepage" text,
  "ingredients" text[] NOT NULL,
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now())
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "cpf" text,
  "phone" text,
  "email" text,
  "file_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now())
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

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

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