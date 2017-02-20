<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 * 
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

namespace oat\taoRestApiDocs\model\service;


interface DocsInterface
{
    const SERVICE_ID = 'taoRestApiDocs/docs';

    const OPTION_DOCS = 'docs';
    const OPTION_PROXY = 'proxy';
    const OPTION_FILE_NAME = 'file';
    const FILE_NAME = 'rest.json';
    const STORAGE_NAME = 'taoRestApiDocs';

    /**
     * Return cached documentation from the storage
     * @return mixed
     */
    public function getDocs();
    
    /**
     * Add new doc file to list of the docs 
     * 
     * @param string $path - path to the file with documentation
     * @return DocsInterface
     */
    public function addDoc($path = '');

    /**
     * Run generation of the documentation
     * 
     * @return DocsInterface
     */
    public function generateDocs();

    /**
     * Write new documentation into the storage and save new configuration for the service
     * @return DocsInterface
     */
    public function saveDocs();

    /**
     * Remove doc file from the list of the docs
     * @param string $path
     * @return DocsInterface
     */
    public function removeDoc($path = '');

    /**
     * Delete current documentation from the storage
     * (configuration file is not touched)
     * @return mixed
     */
    public function dropDocs();
}
