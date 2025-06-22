package com.example.be.dao;

import com.example.be.entities.File;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileDao extends CrudRepository<File, Long> {
    Optional<File> findByPath(String path);
}
