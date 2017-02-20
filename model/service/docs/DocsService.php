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

        if (!$this->hasOption(self::OPTION_FILE_NAME)) {
            $this->setOption(self::OPTION_FILE_NAME, self::FILE_NAME);
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
            throw new RestApiDocsException(__('Please generate documentation before save'));
        }

        $this->dropDocs();

        //write json
        $this->getStorage()->write($this->getOption(self::OPTION_FILE_NAME), json_encode($this->generatedDocs));

        // save new configuration for the documentation
        $serviceManager = ServiceManager::getServiceManager();
        $fs = $serviceManager->get(FileSystemService::SERVICE_ID);
        $fs->getFileSystem('taoRestApiDocs');
        $serviceManager->register(FileSystemService::SERVICE_ID, $fs);
    }

    public function dropDocs()
    {
        if ($this->getStorage()->has($this->getOption(self::OPTION_FILE_NAME))) {
            $this->getStorage()->delete($this->getOption(self::OPTION_FILE_NAME));
        }
    }

    /**
     * @return \League\Flysystem\Filesystem
     */
    private function getStorage()
    {
        return ServiceManager::getServiceManager()
            ->get(FileSystemService::SERVICE_ID)
            ->getFileSystem(self::STORAGE_NAME);
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
            if (!$this->getStorage()->has($this->getOption(self::OPTION_FILE_NAME))) {
                throw new RestApiDocsException(__('Documentation not found'));
            }
            if ($this->getStorage()->has($this->getOption(self::OPTION_FILE_NAME))) {
                $this->generatedDocs = json_decode($this->getStorage()->read($this->getOption(self::OPTION_FILE_NAME)));
            } else {
                $this->generatedDocs = null;
            }
        }

        return $this->generatedDocs;
    }
}
