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


use oat\oatbox\filesystem\FileSystemService;
use oat\oatbox\service\ConfigurableService;
use oat\oatbox\service\ServiceManager;
use oat\taoRestApiDocs\helpers\RestDocHelper;
use oat\taoRestApiDocs\model\exception\RestApiDocsException;
use oat\taoRestApiDocs\model\proxy\DocsProxyInterface;
use oat\taoRestApiDocs\model\proxy\format\Swagger2_0;
use oat\taoRestApiDocs\model\service\DocsInterface;

/**
 * Class DocsService
 * 
 * Generate documentation for Rest API from all extensions
 */
class DocsService extends ConfigurableService implements DocsInterface
{
    const OPTION_DOCS = 'docs';
    const OPTION_PROXY = 'proxy';
    
    const FILE_NAME = 'rest.json';

    /**
     * @var DocsProxyInterface
     */
    private $proxy;

    /**
     * Generated docs after changes of the configuration
     * @var
     */
    private $generatedDocs;
    
    public function __construct(array $options)
    {
        parent::__construct($options);

        $proxyClass = $this->hasOption(self::OPTION_PROXY) ? $this->getOption(self::OPTION_PROXY) : Swagger2_0::class;

        if (!class_exists($proxyClass)) {
            throw new RestApiDocsException(__('Proxy does not exists'));
        }
        
        $this->proxy = new $proxyClass;
        if (!($this->proxy instanceof DocsProxyInterface)) {
            throw new RestApiDocsException(__('Incorrect proxy for Restful documentations'));
        }
    }
    
    public function addDoc($path = '')
    {
        if ($this->proxy->valid(RestDocHelper::getJsonFromFile($path))) {
            $docs = $this->getOption(self::OPTION_DOCS);
            if (!in_array($path, $docs)) {
                $docs[] = $path;
                // drop docs
                $this->generatedDocs = null;
                $this->setOption(self::OPTION_DOCS, $docs);
            }
        } else {
            throw new RestApiDocsException(__('Incorrect file structure'));
        }
        
        return $this;
    }
    
    /**
     * Load docs from config and generate for all files documentation
     * store documentation to data folder
     */
    public function generateDocs()
    {
        
        $this->generatedDocs = RestDocHelper::getDocByExtension('taoRestApiDocs');
        
        foreach ($this->getOption(self::OPTION_DOCS) as $path) {
            $this->generatedDocs = $this->proxy->append($this->generatedDocs, RestDocHelper::getJsonFromFile($path));
        }
        
        return $this;
    }

    public function saveDocs()
    {
        if (!$this->generatedDocs) {
            throw new RestApiDocsException(__('Please, run generateDocs before save'));
        }
        
        
        $this->dropDocs();

        //write json
        $this->getStorage()->write(self::FILE_NAME, json_encode($this->generatedDocs));
        
        // save new configuration for the documentation
        $serviceManager = ServiceManager::getServiceManager();
        $fs = $serviceManager->get(FileSystemService::SERVICE_ID);
        $fs->getFileSystem('taoRestApiDocs');
        $serviceManager->register(FileSystemService::SERVICE_ID, $fs);
    }

    public function removeDoc($path = '')
    {
        $docs = $this->getOption(self::OPTION_DOCS);
        if (in_array($path, $docs)) {
            
            $docs = array_unique($docs);
            unset($docs[array_search($path, $docs)]);
            // drop docs
            $this->generatedDocs = null;

            $this->setOption(self::OPTION_DOCS, $docs);
        }
    }

    /**
     * return json with documentation
     */
    public function getDocs()
    {
        if (!$this->generatedDocs) {
            if (!$this->getStorage()->has(self::FILE_NAME)) {
                throw new RestApiDocsException(__('Please, run generateDocs before'));
            }
            $this->generatedDocs = $this->getStorage()->read(self::FILE_NAME);
        }
        
        return $this->generatedDocs;
    }

    /**
     * @return \League\Flysystem\Filesystem
     */
    private function getStorage()
    {
        return ServiceManager::getServiceManager()
            ->get(FileSystemService::SERVICE_ID)
            ->getFileSystem('taoRestApiDocs');
    }

    public function dropDocs()
    {
        $this->getStorage()->delete(self::FILE_NAME);
    }
}
