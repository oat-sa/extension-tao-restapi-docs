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

namespace oat\taoRestApiDocs\model\service\docs;


use oat\oatbox\service\ConfigurableService;
use oat\taoRestApiDocs\model\service\DocsInterface;

/**
 * Class DocsService
 * 
 * Generate documentation for Rest API from all extensions
 * @package oat\taoRestAPI\service\docs
 */
class DocsService extends ConfigurableService implements DocsInterface
{
    const OPTION_STORAGE_FILE = 'swagger.json';
    
    public function __construct(array $options)
    {
        parent::__construct($options);
    }
    
    public function addDoc($path)
    {
        // validate doc
        // write to config
    }
    
    public function removeDoc()
    {
        // remove line from config
    }
    
    /**
     * Load docs from config and generate for all files documentation
     * store documentation to data folder 
     */
    public function generateDocs()
    {
        // load config
        // create one json with tagged by sections
    }

    /**
     * return json with documentation
     */
    public function getDocs()
    {
        // load log from FileSystem
    }
    
    public function getStorage()
    {
        // use FileSystemService
        // return with init path to the data/taoRestApiDocs/swagger.json
    }
    
    public function dropDocs()
    {
        $this->getStorage();
        // delete from filesystem
    }
    
    public function saveDocs()
    {
        $this->getStorage();
        //write json 
    }
}
